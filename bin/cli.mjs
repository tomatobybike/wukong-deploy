#!/usr/bin/env node
import { argv, exit } from 'node:process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import ora from 'ora'
import inquirer from 'inquirer'

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

switch (command) {
  case 'init': {
    const spinner = ora('正在初始化配置...').start()
    const init = await import(path.resolve(__dirname, '../src/init.mjs')).then(
      (m) => m.default
    )
    await init()
    spinner.succeed('初始化完成 ✅')
    break
  }

  case 'deploy': {
    ensureInitialized()

    const { getServerList } = await import(
      path.resolve(__dirname, '../src/config-loader.mjs')
    )
    const serverList = await getServerList()

    if (!serverList.length) {
      console.warn('⚠️ 未找到任何服务器配置，请先执行 wukong-deploy init 初始化')
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

    const deploy = await import(
      path.resolve(__dirname, '../src/deploy.mjs')
    ).then((m) => m.default)
    await deploy(selectedTarget)
    break
  }

  default:
    console.log(`
用法：
  wukong-deploy init               初始化配置
  wukong-deploy deploy             根据提示选择服务器进行部署
  wukong-deploy deploy [server]    部署指定服务器
  wukong-deploy -h             显示帮助信息
`)
}
