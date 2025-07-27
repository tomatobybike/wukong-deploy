#!/usr/bin/env node
import inquirer from 'inquirer'
import fs from 'node:fs'
import path from 'node:path'
import { argv, exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import ora from 'ora'

import { pathToFileUrl } from '../src/utils/pathToFileUrl.mjs'

const isDev = process.env.DEV_MODE === '1'

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
  // 使用 import.meta.url 获取当前模块的 URL
  const currentModulePath = fileURLToPath(import.meta.url)
  // 从当前模块路径推导出包的根目录
  const packagePath = path.resolve(
    path.dirname(currentModulePath),
    '../package.json'
  )

  try {
    // 尝试读取 package.json
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    console.log(`wukong-deploy v${packageJson.version}`)
  } catch (err) {
    // 如果读取失败，尝试从 __dirname 获取
    try {
      const altPackagePath = path.resolve(__dirname, '../package.json')
      const packageJson = JSON.parse(fs.readFileSync(altPackagePath, 'utf8'))
      console.log(`wukong-deploy v${packageJson.version}`)
    } catch (e) {
      // 如果都失败了，显示固定版本信息
      console.log('wukong-deploy unknow') // 硬编码当前版本作为后备
    }
  }
  process.exit(0)
}

// 打印系统信息，帮助排查Windows问题
if (isDev) {
  console.log(`操作系统: ${process.platform}`)
  console.log(`Node.js版本: ${process.version}`)
  console.log(`CLI目录: ${__dirname}`)
  console.log(`工作目录: ${rootDir}`)
}

switch (command) {
  case 'init': {
    const spinner = ora('正在初始化配置...').start()
    try {
      // 使用URL格式导入模块，确保Windows兼容性
      // Windows下绝对路径必须是有效的file:// URL
      const initPath = path.resolve(__dirname, '../src/init.mjs')
      if (isDev) {
        console.log(`加载初始化模块: ${initPath}`)
      }

      // 将路径转换为URL格式
      const initUrl = pathToFileUrl(initPath)
      if (isDev) {
        console.log(`模块URL: ${initUrl}`)
      }

      const init = await import(initUrl).then((m) => m.default)
      if (isDev) {
        console.log('初始化模块加载成功，开始执行初始化...')
      }

      await init()
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
    ensureInitialized()

    try {
      const configLoaderPath = path.resolve(
        __dirname,
        '../src/config-loader.mjs'
      )
      if (isDev) {
        console.log(`加载配置加载器模块: ${configLoaderPath}`)
      }

      // 将路径转换为URL格式，确保Windows兼容性
      const configLoaderUrl = pathToFileUrl(configLoaderPath)
      if (isDev) {
        console.log(`配置加载器URL: ${configLoaderUrl}`)
      }

      const { getServerList } = await import(configLoaderUrl)
      const serverList = await getServerList()

      if (isDev) {
        console.log(`成功获取服务器列表，共${serverList.length}个服务器配置`)
      }

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
              ...serverList.map((s) => ({ name: s.name, value: s.key })),
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
      if (isDev) {
        console.log(`加载部署模块: ${deployPath}`)
      }

      // 将路径转换为URL格式，确保Windows兼容性
      const deployUrl = pathToFileUrl(deployPath)
      if (isDev) {
        console.log(`部署模块URL: ${deployUrl}`)
      }

      const deploy = await import(deployUrl).then((m) => m.default)
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

  default:
    console.log(`
用法：
  wukong-deploy init               初始化配置
  wukong-deploy deploy             根据提示选择服务器进行部署
  wukong-deploy deploy [server]    部署指定服务器
  wukong-deploy -v, --version      显示版本号
  wukong-deploy -h                 显示帮助信息
`)
}
