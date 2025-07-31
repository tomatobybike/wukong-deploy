import dotenv from 'dotenv'
import fs from 'fs-extra'
import { NodeSSH } from 'node-ssh'
import path from 'path'

import { devLog } from './utils/devLog.mjs'
import { exitWithTime } from './utils/exitWithTime.mjs'
import logger from './utils/logger.mjs'
import { pathToFileUrl } from './utils/pathToFileUrl.mjs'
import { validateCommandResult } from './utils/validateCommandResult.mjs'

const rootDir = process.cwd()
// 使用path.join确保跨平台兼容性
const configFile = path.resolve(rootDir, path.join('config', 'config.mjs'))
const envFile = path.resolve(rootDir, '.env')
const logCache = { write: true }

// 调试信息
devLog(`部署模块 - 工作目录: ${rootDir}`)
devLog(`部署模块 - 配置文件路径: ${configFile}`)
devLog(`部署模块 - 环境文件路径: ${envFile}`)

// 检查文件是否存在
if (!fs.existsSync(configFile)) {
  console.error(`配置文件不存在: ${configFile}`)
  process.exit(1)
}

if (!fs.existsSync(envFile)) {
  console.error(`环境文件不存在: ${envFile}`)
  process.exit(1)
}

dotenv.config({ path: envFile })

export default async function deploy(targetKey) {
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
      console.error('❌ 配置文件格式错误，缺少 default.servers 对象')
      process.exit(1)
    }
  } catch (error) {
    console.error(`❌ 导入配置文件失败: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  }

  const server = config.default.servers[targetKey]
  if (!server) {
    console.error(`❌ 配置中找不到服务器 key: ${targetKey}`)
    process.exit(1)
  }

  console.log(`找到服务器配置: ${server.name}`)

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
    console.error('❌ 请配置私钥或密码环境变量')
    process.exit(1)
  }

  logger.info(`🔗 Connecting to ${server.name} (${server.host})...`, logCache)
  try {
    await ssh.connect(connectConfig)
    logger.success('✅ SSH 连接成功', logCache)
  } catch (err) {
    logger.error(`❌ SSH 连接失败：${err.message}`, logCache)
    process.exit(1)
  }

  for (const cmdObj of server.commands) {
    const { cmd, cwd, description } = cmdObj
    logger.info(`💻 执行命令：${cmd} ${description}`, logCache)
    // eslint-disable-next-line no-await-in-loop
    const result = await ssh.execCommand(cmd, { cwd })
    if (config.default.showCommandLog) {
      if (result.stdout) logger.info(`🟢 STDOUT:\n${result.stdout}`, logCache)
      if (result.stderr) logger.info(`🔴 STDERR:\n${result.stderr}`, logCache)
    }
    if (validateCommandResult(result, cmdObj)) {
      ssh.dispose()
      return exitWithTime(start, 1)
    }
  }

  ssh.dispose()
  const finishMsg =
    `${server.finishMsg} ${targetKey}` || `🚀 部署 ${targetKey} 完成`
  logger.success(finishMsg, logCache)
  exitWithTime(start, 0) // 正常完成时调用，统一退出
}
