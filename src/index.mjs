// @file: wukong-deploy/src/index.mjs
import dotenv from 'dotenv'
import inquirer from 'inquirer'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ora from 'ora'

import { getServerList } from './config-loader.mjs'

import deploy from './deploy.mjs'
import init from './init.mjs'
import { sendTelemetry } from './lib/telemetry.wukong.mjs'
import { devLog } from './utils/devLog.mjs'
import { doctor } from './utils/doctor.mjs'
import { showExample, showHelp } from './utils/help/help.mjs'
import { i18nGetRaw, i18nInfo, i18nLogNative } from './utils/i18n.mjs'
import { printAuthorInfo } from './utils/info.mjs'
import { getLang } from './utils/langDetect.mjs'
import { showEnv } from './utils/showEnv.mjs'
import { showVersionInfo } from './utils/showVersionInfo.mjs'

dotenv.config()

const getMyVersion = () => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'unknown'
}

let VERSION = ''

const isHideHost = process.env.WUKONG_HIDE_HOST === '1'

function parseValue(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!value.isNaN) return Number(value)
  return value
}

/** 参数解析器 */
function parseArgs(argv) {
  const flags = {}
  const args = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg.startsWith('--')) {
      if (arg.includes('=')) {
        const [key, value] = arg.slice(2).split('=')
        flags[key] = parseValue(value)
      } else if (arg.startsWith('--no-')) {
        flags[arg.slice(5)] = false
      } else {
        const key = arg.slice(2)
        const next = argv[i + 1]
        if (!next || next.startsWith('--')) {
          flags[key] = true
        } else {
          flags[key] = parseValue(next)
          i++
        }
      }
    } else {
      args.push(arg)
    }
  }

  return {
    command: args[0],
    target: args[1],
    flags
  }
}

const main = async () => {
  process.on('uncaughtException', (error) => {
    if (error.name === 'ExitPromptError') {
      i18nLogNative('uncaughtException')
      process.exit(0)
    }

    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    // @ts-ignore
    if (reason?.name === 'ExitPromptError') {
      i18nLogNative('uncaughtException')
      process.exit(0)
    } else {
      process.exit(1)
    }
  })

  VERSION = getMyVersion()
  const { command, target } = parseArgs(process.argv.slice(2))

  sendTelemetry('start', { version: VERSION }).catch(() => {})

  // const __dirname = getProjectRoot()
  const rootDir = process.cwd()

  const configPath = path.join(rootDir, 'config', 'config.mjs')
  const envPath = path.join(rootDir, '.env')

  const ensureInitialized = () => {
    if (!fs.existsSync(configPath) || !fs.existsSync(envPath)) {
      i18nInfo(`notInitialized`)
      process.exit(1)
    }
  }

  // 显示版本号
  if (command === '-v' || command === '--version') {
    sendTelemetry('version', { version: VERSION }).catch(() => {})
    showVersionInfo()
    process.exit(0)
  }

  // 打印系统信息
  devLog(`操作系统: ${process.platform}`)
  devLog(`Node.js版本: ${process.version}`)

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
          const serversNames = {
            name: server.name,
            host: isHideHost ? '***.**.**.**' : server.host
          }

          i18nLogNative('serverFound', serversNames)
          server.commands?.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd.description}: ${cmd.cmd}`)
          })
        }
        console.log()
        process.exit(0)
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
                ...serverList.map((s) => {
                  const nameString = isHideHost
                    ? `${s.name}`
                    : `${s.name} ${s.host}`
                  return {
                    name: nameString,
                    value: s.key
                  }
                }),
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

        const selectedServer = serverList.find((s) => s.key === selectedTarget)
        if (!selectedServer) {
          i18nLogNative('deploy.notFound')
          i18nLogNative('deploy.hintListCommand')
          process.exit(0)
        }

        i18nLogNative('deploy.executingOnServer', {
          name: selectedServer.name,
          host: isHideHost ? '' : selectedServer.host
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

    case 'env': {
      showEnv()
      process.exit(0)
      break
    }
    case 'doctor': {
      doctor()
      const { flags } = parseArgs(process.argv.slice(2))
      if (flags.env) {
        console.log()
        showEnv()
      }
      break
    }
    case 'info':
    case '--about':
    case '--info': {
      sendTelemetry('info', { version: VERSION }).catch(() => {})
      const lang = getLang()
      printAuthorInfo({ lang, version: VERSION })
      process.exit(0)
      break
    }

    case 'example':
    case '--example':
    case '-e': {
      sendTelemetry('example', { version: VERSION }).catch(() => {})
      const lang = getLang()
      await showExample({ lang })
      process.exit(0)
      break
    }

    default: {
      const lang = getLang()
      showHelp({ lang, version: VERSION })
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
  console.error('main function error:', err)
  process.exit(1)
})
