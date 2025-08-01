/**
 * @file: wukong-deploy/src/index.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-01 15:11
 */
import inquirer from 'inquirer'
import fs from 'node:fs'
import path from 'node:path'
import process, { argv, exit } from 'node:process'
import ora from 'ora'

import { getServerList } from './config-loader.mjs'

import deploy from './deploy.mjs'
import init from './init.mjs'
import { sendTelemetry } from './lib/telemetry.wukong.mjs'
import { devLog } from './utils/devLog.mjs'
import { getProjectRoot } from './utils/getBaseDir.mjs'
import { showExample, showHelp } from './utils/help/help.mjs'
import { i18nGetRaw, i18nInfo, i18nLogNative } from './utils/i18n.mjs'
import { printAuthorInfo } from './utils/info.mjs'
import { getLang } from './utils/langDetect.mjs'

const getMyVersion = async () => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'unknown'
}

let VERSION = ''

const main = async () => {
  process.on('uncaughtException', (error) => {
    if (error.name === 'ExitPromptError') {
      console.log('\n🚪 用户取消了部署（Ctrl+C）')
      process.exit(0)
    }

    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    // @ts-ignore
    if (reason?.name === 'ExitPromptError') {
      console.log('\n🚪 用户取消了部署（Ctrl+C）')
      process.exit(0)
    } else {
      process.exit(1)
    }
  })
  VERSION = await getMyVersion()
  sendTelemetry('start', { version: VERSION }).catch(() => {})

  const command = argv[2]
  const target = argv[3]

  const __dirname = getProjectRoot() // 用于 CLI 自身路径
  const rootDir = process.cwd() // 用于用户目录

  const configPath = path.join(rootDir, 'config', 'config.mjs')
  const envPath = path.join(rootDir, '.env')

  const ensureInitialized = () => {
    if (!fs.existsSync(configPath) || !fs.existsSync(envPath)) {
      i18nInfo(`notInitialized`)
      exit(1)
    }
  }

  // 显示版本号
  if (command === '-v' || command === '--version') {
    sendTelemetry('version', { version: VERSION }).catch(() => {})
    console.log(`wukong-deploy v${VERSION}`)
    process.exit(0)
  }

  // 打印系统信息，帮助排查Windows问题
  devLog(`操作系统: ${process.platform}`)
  devLog(`Node.js版本: ${process.version}`)
  devLog(`CLI目录: ${__dirname}`)
  devLog(`工作目录: ${rootDir}`)

  switch (command) {
    case 'list': {
      sendTelemetry('list', { version: VERSION }).catch(() => {})
      ensureInitialized()
      try {
        const serverList = await getServerList()

        if (!serverList.length) {
          i18nLogNative('noServers')
          process.exit(1)
        }

        i18nLogNative('serverList')
        for (const server of serverList) {
          // console.log(`\n🖥️  ${server.name} (${server.host})\n   部署命令：`)
          i18nLogNative('serverFound', { name: server.name, host: server.host })
          server.commands?.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd.description}: ${cmd.cmd}`)
          })
        }
        console.log()
      } catch (error) {
        i18nLogNative('getServerListFail', { msg: error.message })
        process.exit(1)
      }
      break
    }

    case 'init': {
      sendTelemetry('init', { version: VERSION }).catch(() => {})
      const spinner = ora(i18nGetRaw('init.starting')).start()

      try {
        await init(spinner)
        spinner.succeed(i18nGetRaw('init.success'))
      } catch (error) {
        spinner.fail(i18nGetRaw('init.failure'))
        console.error(i18nGetRaw('init.errorMessage', { msg: error.message }))

        console.error(error.stack)
        process.exit(1)
      }
      break
    }

    case 'deploy': {
      sendTelemetry('deploy', { version: VERSION }).catch(() => {})
      ensureInitialized()

      try {
        const serverList = await getServerList()

        devLog(`成功获取服务器列表，共${serverList.length}个服务器配置`)

        if (!serverList.length) {
          i18nLogNative('noServers')

          process.exit(1)
        }

        let selectedTarget = target

        if (!target) {
          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'target',
              message: i18nGetRaw('deploy.selectTarget'),
              choices: [
                ...serverList.map((s) => ({
                  name: `${s.name} ${s.host}`,
                  value: s.key
                })),
                new inquirer.Separator(),
                { name: i18nGetRaw('deploy.cancelOption'), value: '__exit' }
              ]
            }
          ])

          selectedTarget = answer.target
          if (selectedTarget === '__exit') {
            i18nLogNative('deploy.cancelDeploy')
            process.exit(0)
          }
        }

        // 显示将要执行的命令并确认
        const selectedServer = serverList.find((s) => s.key === selectedTarget)
        if (!selectedServer) {
          i18nLogNative('deploy.notFound')
          i18nLogNative('deploy.hintListCommand')
          process.exit(0)
        }

        i18nLogNative('deploy.executingOnServer', {
          name: selectedServer.name,
          host: selectedServer.host
        })
        selectedServer.commands?.forEach((cmd, index) => {
          console.log(`${index + 1}. ${cmd.description}: ${cmd.cmd}`)
        })

        const confirmation = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: i18nGetRaw('deploy.commandConfirm'),
            default: false
          }
        ])

        if (!confirmation.proceed) {
          i18nLogNative('cancelDeploy')
          process.exit(0)
        }

        await deploy(selectedTarget)
      } catch (error) {
        if (error.name === 'ExitPromptError') {
          i18nLogNative('userCancel')
          process.exit(0)
        }

        i18nLogNative('deployError', { msg: error.message })
        console.error(error.stack)
        process.exit(1)
      }
      break
    }
    case 'info':
    case '--about':
    case '--info': {
      sendTelemetry('info', { version: VERSION }).catch(() => {})
      const version = await getMyVersion()
      const lang = getLang()
      printAuthorInfo({ lang, version })
      process.exit(0)
      // @ts-ignore
      break
    }
    case 'example':
    case '--example':
    case '-e': {
      sendTelemetry('example', { version: VERSION }).catch(() => {})
      const lang = getLang()
      await showExample({ lang })
      process.exit(0)
      // @ts-ignore
      break
    }
    default: {
      const lang = getLang()
      const version = await getMyVersion()
      await showHelp({ lang, version })
      process.exit(0)
    }
  }
}

main().catch((err) => {
  sendTelemetry('error', {
    version: VERSION,
    message: err.message,
    stack: err.stack
  }).catch(() => {})
  console.error('主函数异常:', err)
  process.exit(1)
})
