/**
 * @file: wukong-deploy/src/index.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-01 15:11
 */
import dotenv from 'dotenv'
import inquirer from 'inquirer'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ora from 'ora'

import { CLI_NAME } from './constants/index.mjs'
import deploy from './deploy.mjs'
import init from './init.mjs'
import { sendTelemetry } from './lib/telemetry.wukong.mjs'
import { backupFiles } from './utils/backupFiles.mjs'
import { checkUpdateWithPatch } from './utils/checkUpdate.mjs'
import { getServerList } from './utils/config-loader.mjs'
import { devLog } from './utils/devLog.mjs'
import { doctor } from './utils/doctor.mjs'
import { emojiEnabled } from './utils/emoji.mjs'
import { showExample, showHelp } from './utils/help/help.mjs'
import { i18nGetRaw, i18nInfo, i18nLogNative } from './utils/i18n.mjs'
import { printAuthorInfo } from './utils/info.mjs'
import { getLang } from './utils/langDetect.mjs'
import { showEnv } from './utils/showEnv.mjs'
import { showVersionInfo } from './utils/showVersionInfo.mjs'

dotenv.config()

// 不再需要读文件了，直接用 define 注入的常量

// @ts-ignore
// eslint-disable-next-line no-undef
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'dev'
// @ts-ignore
// eslint-disable-next-line no-undef
const PKG_NAME = typeof __PKG_NAME__ !== 'undefined' ? __PKG_NAME__ : 'unknown'

const isHideHost = process.env.WUKONG_HIDE_HOST === '1'
const OPTION_EVENT = {
  cli: CLI_NAME,
  version: VERSION
}

const autoCheckUpdate = async () => {
  // === CLI 主逻辑完成后提示更新 ===
  await checkUpdateWithPatch({
    pkg: {
      name: PKG_NAME,
      version: VERSION
    },
    force: true
  })
}

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

function ensureInitialized() {
  const rootDir = process.cwd()
  const configPath = path.join(rootDir, 'config', 'config.mjs')
  const envPath = path.join(rootDir, '.env')
  if (!fs.existsSync(configPath) || !fs.existsSync(envPath)) {
    i18nInfo('notInitialized')
    process.exit(1)
  }
}

// command handlers
const handlers = {
  async list() {
    await sendTelemetry('list', { ...OPTION_EVENT }).catch(() => {})
    ensureInitialized()

    try {
      const servers = await getServerList()
      if (!servers.length) {
        i18nLogNative('noServers')
        process.exit(1)
      }

      i18nLogNative('serverList')
      for (const s of servers) {
        i18nLogNative('serverFound', {
          name: s.name,
          host: isHideHost ? '***.**.**.**' : s.host
        })
        s.commands?.forEach((cmd, i) => {
          console.log(`   ${i + 1}. ${cmd.description}: ${cmd.cmd}`)
        })
      }
      console.log()
      process.exit(0)
    } catch (e) {
      i18nLogNative('getServerListFail', { msg: e.message })
      process.exit(1)
    }
  },

  async init() {
    await sendTelemetry('init', { ...OPTION_EVENT }).catch(() => {})
    const spinner = ora(i18nGetRaw('init.starting')).start()
    try {
      await init(spinner)
      spinner.succeed(i18nGetRaw('init.success'))
    } catch (e) {
      spinner.fail(i18nGetRaw('init.failure'))
      console.error(i18nGetRaw('init.errorMessage', { msg: e.message }))
      console.error(e.stack)
      process.exit(1)
    }
  },

  async deploy(target) {
    await sendTelemetry('deploy', { ...OPTION_EVENT }).catch(() => {})
    ensureInitialized()

    try {
      const servers = await getServerList()
      if (!servers.length) {
        i18nLogNative('noServers')
        process.exit(1)
      }

      let selected = target
      if (!selected) {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'target',
            message: i18nGetRaw('deploy.selectTarget'),
            choices: [
              ...servers.map((s) => ({
                name: isHideHost ? s.name : `${s.name} ${s.host}`,
                value: s.key
              })),
              new inquirer.Separator(),
              { name: i18nGetRaw('deploy.cancelOption'), value: '__exit' }
            ]
          }
        ])
        selected = answer.target
        if (selected === '__exit') {
          i18nLogNative('deploy.cancelDeploy')
          process.exit(0)
        }
      }

      const server = servers.find((s) => s.key === selected)
      if (!server) {
        i18nLogNative('deploy.notFound')
        i18nLogNative('deploy.hintListCommand')
        process.exit(1)
      }

      i18nLogNative('deploy.executingOnServer', {
        name: server.name,
        host: isHideHost ? '' : server.host
      })

      server.commands?.forEach((cmd, i) =>
        console.log(`${i + 1}. ${cmd.description}: ${cmd.cmd}`)
      )

      const confirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: i18nGetRaw('deploy.commandConfirm'),
          default: false
        }
      ])

      if (!confirm.proceed) {
        i18nLogNative('cancelDeploy')
        process.exit(0)
      }
      await sendTelemetry('deployConfirm', { ...OPTION_EVENT }).catch(() => {})
      await deploy(selected)
      await sendTelemetry('deploySuccess', { ...OPTION_EVENT }).catch(() => {})
    } catch (e) {
      await sendTelemetry('deployError', {
        version: VERSION,
        message: e.message,
        stack: e.stack
      }).catch(() => {})
      if (e.name === 'ExitPromptError') {
        i18nLogNative('userCancel')
        process.exit(0)
      }
      i18nLogNative('deployError', { msg: e.message })
      console.error(e.stack)
      process.exit(1)
    }
  },

  async doctor(flags) {
    await sendTelemetry('doctor', { ...OPTION_EVENT }).catch(() => {})
    doctor()
    if (flags.env) {
      console.log()
      showEnv()
    }
  },

  async env() {
    await sendTelemetry('env', { ...OPTION_EVENT }).catch(() => {})
    showEnv()
    process.exit(0)
  },

  async example() {
    await sendTelemetry('example', { ...OPTION_EVENT }).catch(() => {})

    const lang = getLang()
    await showExample({ lang })
    process.exit(0)
  },
  async clear() {
    await sendTelemetry('clear', { ...OPTION_EVENT }).catch(() => {})

    const backupDir = path.join(process.cwd(), 'backup')

    if (!fs.existsSync(backupDir)) {
      i18nLogNative('backup.noBackupDir')
      process.exit(0)
    }

    const { confirm } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: i18nGetRaw('backup.confirmClearBackup'),
      default: false
    })

    if (!confirm) {
      i18nLogNative('backup.clearCanceled')
      process.exit(0)
    }

    try {
      await fs.promises.rm(backupDir, { recursive: true, force: true })
      i18nLogNative('backup.clearSuccess')
    } catch (err) {
      i18nLogNative('backup.clearFailed', { msg: err.message })
      process.exit(1)
    }

    process.exit(0)
  },
  async backup() {
    await sendTelemetry('backup', { ...OPTION_EVENT }).catch(() => {})

    const rootDir = process.cwd()
    const configPath = path.join(rootDir, 'config', 'config.mjs')
    const envPath = path.join(rootDir, '.env')

    const success = await backupFiles(configPath, envPath)
    process.exit(success ? 0 : 1)
  },
  async info() {
    await sendTelemetry('info', { ...OPTION_EVENT }).catch(() => {})
    const lang = getLang()
    printAuthorInfo({ lang, version: VERSION })
    if (!emojiEnabled) {
      i18nLogNative('emojiWarning')
    }
    process.exit(0)
  },

  async version() {
    await sendTelemetry('version', { ...OPTION_EVENT }).catch(() => {})
    showVersionInfo(VERSION)
    await autoCheckUpdate()
    process.exit(0)
  },

  async help() {
    await sendTelemetry('help', { ...OPTION_EVENT }).catch(() => {})

    const lang = getLang()
    showHelp({ lang, version: VERSION })

    await autoCheckUpdate()
    process.exit(0)
  }
}

async function main() {
  await sendTelemetry('start', { ...OPTION_EVENT }).catch(() => {})
  const { command, target, flags } = parseArgs(process.argv.slice(2))

  devLog(`操作系统: ${process.platform}`)
  devLog(`Node.js版本: ${process.version}`)

  const normalizedCmd = command?.replace(/^--/, '')

  try {
    switch (normalizedCmd) {
      case '-v':
      case 'version':
        await handlers.version()
        break
      case 'list':
        await handlers.list()
        break
      case 'init':
        await handlers.init()
        break
      case 'deploy':
        await handlers.deploy(target)
        break
      case 'env':
        await handlers.env()
        break
      case 'doctor':
        await handlers.doctor(flags)
        break
      case 'info':
      case 'about':
        await handlers.info()
        break
      case 'example':
      case '-e':
        await handlers.example()
        break
      case 'backup':
        await handlers.backup()
        break
      case 'clear':
        await handlers.clear()
        break

      default:
        await handlers.help()
        break
    }
  } catch (err) {
    await sendTelemetry('error', {
      ...OPTION_EVENT,
      message: err.message,
      stack: err.stack
    }).catch(() => {})
    console.error('main function error:', err)
    process.exit(1)
  }
}

process.on('uncaughtException', (err) => {
  if (err.name === 'ExitPromptError') {
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
  }
  process.exit(1)
})

main()
