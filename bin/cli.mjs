#!/usr/bin/env node
import inquirer from 'inquirer'
import fs from 'node:fs'
import path from 'node:path'
import { argv, exit } from 'node:process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ora from 'ora'

import { sendTelemetry } from '../src/lib/telemetry.wukong.mjs'
import { devLog } from '../src/utils/devLog.mjs'
import { showHelp } from '../src/utils/help.mjs'
import { printAuthorInfo } from '../src/utils/info.mjs'
import { getLang } from '../src/utils/langDetect.mjs'
import { pathToFileUrl } from '../src/utils/pathToFileUrl.mjs'
import { getVersion } from '../src/utils/version.mjs'

const getPackagePaths = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  // 使用 import.meta.url 获取当前模块的 URL
  const currentModulePath = fileURLToPath(import.meta.url)
  // 从当前模块路径推导出包的根目录
  const pathsToTry = [
    path.resolve(path.dirname(currentModulePath), '../package.json'),
    path.resolve(__dirname, '../package.json')
  ]
  return pathsToTry
}

const getMyVersion = async () => {
  const packagePaths = getPackagePaths()
  const version = await getVersion(packagePaths)
  return version || 'unknown'
}

let VERSION = ''

const main = async () => {
  VERSION = await getMyVersion()
  sendTelemetry('start', { version: VERSION }).catch(() => {})
  process.on('uncaughtException', (error) => {
    if (error.name === 'ExitPromptError') {
      console.log('\n🚪 用户取消了部署（Ctrl+C）')
      process.exit(0)
    }

    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    if (reason?.name === 'ExitPromptError') {
      console.log('\n🚪 用户取消了部署（Ctrl+C）')
      process.exit(0)
    } else {
      process.exit(1)
    }
  })

  const command = argv[2]
  const target = argv[3]

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const rootDir = process.cwd()

  const configPath = path.join(rootDir, 'config', 'config.mjs')
  const envPath = path.join(rootDir, '.env')



  const ensureInitialized = () => {
    if (!fs.existsSync(configPath) || !fs.existsSync(envPath)) {
      console.error('❌ 项目未初始化，请先执行：wukong-deploy init')
      exit(1)
    }
  }

  // 显示版本号
  if (command === '-v' || command === '--version') {
    sendTelemetry('version', { version: VERSION }).catch(() => {})
    console.log(`wukong-deploy v${version}`)
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
        const configLoaderPath = path.resolve(
          __dirname,
          '../src/config-loader.mjs'
        )
        const configLoaderUrl = pathToFileUrl(configLoaderPath)
        const { getServerList } = await import(configLoaderUrl)
        const serverList = await getServerList()

        if (!serverList.length) {
          console.warn(
            '⚠️ 未找到任何服务器配置，请先执行 wukong-deploy init 初始化'
          )
          process.exit(1)
        }

        console.log('\n📋 服务器列表：')
        for (const server of serverList) {
          console.log(`\n🖥️  ${server.name} (${server.host})\n   部署命令：`)
          server.commands?.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd.description}: ${cmd.cmd}`)
          })
        }
        console.log()
      } catch (error) {
        console.error(`❌ 获取服务器列表失败: ${error.message}`)
        process.exit(1)
      }
      break
    }

    case 'init': {
      sendTelemetry('init', { version: VERSION }).catch(() => {})
      const spinner = ora('正在初始化配置...').start()
      try {
        // 使用URL格式导入模块，确保Windows兼容性
        // Windows下绝对路径必须是有效的file:// URL
        const initPath = path.resolve(__dirname, '../src/init.mjs')
        devLog(`加载初始化模块: ${initPath}`)

        // 将路径转换为URL格式
        const initUrl = pathToFileUrl(initPath)
        devLog(`模块URL: ${initUrl}`)

        const init = await import(initUrl).then((m) => m.default)
        devLog('初始化模块加载成功，开始执行初始化...')

        await init(spinner)
        spinner.succeed('初始化完成 ✅')
      } catch (error) {
        spinner.fail('初始化失败')
        console.error(`初始化错误: ${error.message}`)
        console.error(error.stack)
        process.exit(1)
      }
      break
    }

    case 'deploy': {
      sendTelemetry('deploy', { version: VERSION }).catch(() => {})
      ensureInitialized()

      try {
        const configLoaderPath = path.resolve(
          __dirname,
          '../src/config-loader.mjs'
        )
        devLog(`加载配置加载器模块: ${configLoaderPath}`)

        // 将路径转换为URL格式，确保Windows兼容性
        const configLoaderUrl = pathToFileUrl(configLoaderPath)
        devLog(`配置加载器URL: ${configLoaderUrl}`)

        const { getServerList } = await import(configLoaderUrl)
        const serverList = await getServerList()

        devLog(`成功获取服务器列表，共${serverList.length}个服务器配置`)

        if (!serverList.length) {
          console.warn(
            '⚠️ 未找到任何服务器配置，请先执行 wukong-deploy init 初始化'
          )
          process.exit(1)
        }

        let selectedTarget = target

        if (!target) {
          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'target',
              message: '请选择要部署的服务器',
              choices: [
                ...serverList.map((s) => ({
                  name: `${s.name} ${s.host}`,
                  value: s.key
                })),
                new inquirer.Separator(),
                { name: '❌ 退出部署', value: '__exit' }
              ]
            }
          ])

          selectedTarget = answer.target
          if (selectedTarget === '__exit') {
            console.log('🚪 已取消部署。')
            process.exit(0)
          }
        }

        const deployPath = path.resolve(__dirname, '../src/deploy.mjs')
        devLog(`加载部署模块: ${deployPath}`)

        // 将路径转换为URL格式，确保Windows兼容性
        const deployUrl = pathToFileUrl(deployPath)
        devLog(`部署模块URL: ${deployUrl}`)

        const deploy = await import(deployUrl).then((m) => m.default)

        // 显示将要执行的命令并确认
        const selectedServer = serverList.find((s) => s.key === selectedTarget)
        if (!selectedServer) {
          console.error(
            '❌ 未找到指定的服务器配置,请检查配置文件是否正确 \n use: wukong-deploy list \n 查看所有服务器配置'
          )
          process.exit(1)
        }
        console.log(
          `\n📋 即将在 ${selectedServer.name} (${selectedServer.host}) 执行以下命令：`
        )
        selectedServer.commands?.forEach((cmd, index) => {
          console.log(`${index + 1}. ${cmd.description}: ${cmd.cmd}`)
        })

        const confirmation = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: '确认要执行这些命令吗？',
            default: false
          }
        ])

        if (!confirmation.proceed) {
          console.log('🚪 已取消部署。')
          process.exit(0)
        }

        await deploy(selectedTarget)
      } catch (error) {
        if (error.name === 'ExitPromptError') {
          console.log('🚪 用户取消了部署（Ctrl+C）')
          process.exit(0)
        }
        console.error(`❌ 部署过程中出错: ${error.message}`)
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
    }

    default: {
      const lang = getLang()
      const version = await getMyVersion()
      await showHelp({ lang, version })
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
