/**
 * @file: deploy.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-01 15:00
 */
import { spawn } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs-extra'
import { NodeSSH } from 'node-ssh'
import path from 'path'

import { devLog } from './utils/devLog.mjs'
import { e } from './utils/emoji.mjs'
import { exitWithTime } from './utils/exitWithTime.mjs'
import {
  i18nError,
  i18nGetRaw,
  i18nInfo,
  i18nLogNative,
  i18nSuccess
} from './utils/i18n.mjs'
import logger from './utils/logger.mjs'
import { openUrl } from './utils/openUrl.mjs'
import { pathToFileUrl } from './utils/pathToFileUrl.mjs'
import { validateCommandResult } from './utils/validateCommandResult.mjs'

const handleCheckEnv = () => {
  const rootDir = process.cwd()
  // 使用path.join确保跨平台兼容性
  const configFile = path.resolve(rootDir, path.join('config', 'config.mjs'))
  const envFile = path.resolve(rootDir, '.env')

  // 调试信息
  devLog(`部署模块 - 工作目录: ${rootDir}`)
  devLog(`部署模块 - 配置文件路径: ${configFile}`)
  devLog(`部署模块 - 环境文件路径: ${envFile}`)

  // 检查文件是否存在
  if (!fs.existsSync(configFile)) {
    i18nLogNative('configFileNotExist', { file: configFile })
    process.exit(1)
  }

  if (!fs.existsSync(envFile)) {
    i18nLogNative('envFileNotExist', { file: envFile })

    process.exit(1)
  }

  dotenv.config({ path: envFile })
  return configFile
}

export default async function launch(targetKey) {
  const isHideHost = process.env.WUKONG_HIDE_HOST === '1'
  const configFile = handleCheckEnv()
  const logCache = { write: true }
  const start = performance.now()
  logger.info('start deploy', { ...logCache, newline: true })
  // 动态导入配置文件
  let config
  try {
    devLog(`尝试导入配置文件: ${configFile}`)

    // 将路径转换为URL格式，确保Windows兼容性
    const configFileUrl = pathToFileUrl(configFile)

    devLog(`配置文件URL: ${configFileUrl}`)

    config = await import(configFileUrl)

    if (!config.default || !config.default.servers) {
      i18nLogNative('configFormatError')

      process.exit(1)
    }
  } catch (error) {
    i18nError('importConfigFail', { msg: error.message })
    console.error(error.stack)
    process.exit(1)
  }

  const server = config.default.servers[targetKey]
  if (!server) {
    i18nLogNative('configKeyNotFound', { key: targetKey })

    process.exit(1)
  }

  i18nLogNative('foundServer', { name: server.name })

  const ssh = new NodeSSH()
  const connectConfig = {
    host: server.host,
    username: server.username,
    port: server.port || 22
  }

  if (server.privateKey) {
    connectConfig.privateKey = server.privateKey.replace(
      /^~\//,
      `${process.env.HOME}/`
    )
  } else if (server.passwordEnv) {
    connectConfig.password = process.env[server.passwordEnv]
  } else {
    i18nLogNative('needKeyOrPwd')
    process.exit(1)
  }

  if (isHideHost) {
    logger.info(`${e('🔗')} Connecting to ${server.name} ...`, logCache)
  } else {
    logger.info(
      `${e('🔗')} Connecting to ${server.name} (${server.host})...`,
      logCache
    )
  }
  try {
    await ssh.connect(connectConfig)

    i18nSuccess('sshConnectSuccess')
  } catch (err) {
    i18nError('sshConnectFail', { msg: err.message })

    process.exit(1)
  }

  for (const cmdObj of server.commands) {
    const { cmd, cwd, description, isLocal } = cmdObj
    i18nInfo('execCommand', { cmd, desc: description })
    if (isLocal) {
      // 处理本地命令
      if (/^https?:\/\//.test(cmd)) {
        // URL，直接用浏览器打开
        console.log(`🌐 打开浏览器: ${cmd}`)
        try {
          // 用 new URL 确保 Windows 不会误判
          const url = new URL(cmd).href
          // eslint-disable-next-line no-await-in-loop
          await openUrl(url)
        } catch (err) {
          console.error(`❌ 打开浏览器失败: ${cmd}`, err.message)
        }
      } else {
        // 普通本地命令（如 yarn -v, curl ...）
        console.log(`⚡ 执行本地命令: ${cmd}`)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve, reject) => {
          const child = spawn(cmd, {
            cwd: cwd || process.cwd(),
            stdio: 'inherit',
            shell: true
          })
          child.on('close', (code) => {
            if (code === 0) resolve()
            else reject(new Error(`本地命令失败: ${cmd}`))
          })
        })
      }
    } else {
      // eslint-disable-next-line no-await-in-loop
      const result = await ssh.execCommand(cmd, { cwd })
      if (config.default.showCommandLog) {
        if (result.stdout)
          logger.info(`${e('🟢')} STDOUT:\n${result.stdout}`, logCache)
        if (result.stderr)
          logger.info(`${e('🔴')}  STDERR:\n${result.stderr}`, logCache)
      }
      if (validateCommandResult(result, cmdObj)) {
        ssh.dispose()
        return exitWithTime(start, 1)
      }
    }
  }

  ssh.dispose()
  const finishMsg =
    `${server.finishMsg} ${targetKey}` ||
    i18nGetRaw('deployComplete', { msg: targetKey })
  logger.success(finishMsg, logCache)
  exitWithTime(start, 0) // 正常完成时调用，统一退出
}
