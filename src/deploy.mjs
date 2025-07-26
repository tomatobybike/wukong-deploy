import dotenv from 'dotenv'
import { NodeSSH } from 'node-ssh'
import path from 'path'

import logger from './logger.mjs'
import { exitWithTime } from './utils/exitWithTime.mjs'

const rootDir = process.cwd()
const configFile = path.resolve(rootDir, 'config/config.mjs')
dotenv.config({ path: path.resolve(rootDir, '.env') })

export default async function deploy(targetKey) {
  const start = performance.now()

  // 动态导入配置文件
  const config = await import(configFile)
  const server = config.default.servers[targetKey]
  if (!server) {
    console.error(`❌ 配置中找不到服务器 key: ${targetKey}`)
    process.exit(1)
  }

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

  logger.info(`🔗 Connecting to ${server.name} (${server.host})...`)
  try {
    await ssh.connect(connectConfig)
    logger.success('✅ SSH 连接成功')
  } catch (err) {
    logger.error(`❌ SSH 连接失败：${err.message}`)
    process.exit(1)
  }

  for (const cmd of server.commands) {
    logger.info(`💻 执行命令：${cmd}`)
    // eslint-disable-next-line no-await-in-loop
    const result = await ssh.execCommand(cmd)
    if (config.default.showCommandLog) {
      if (result.stdout) logger.info(`🟢 STDOUT:\n${result.stdout}`)
      if (result.stderr) logger.error(`🔴 STDERR:\n${result.stderr}`)
    }
    if (result.code !== 0) {
      logger.error(
        `❌ 命令执行失败，退出部署。命令：${cmd}，退出码：${result.code}`
      )
      ssh.dispose()
      exitWithTime(start, 1)
    }
  }

  ssh.dispose()
  const finishMsg =
    `\n ${server.finishMsg} ${targetKey}` || `🚀 部署 ${targetKey} 完成`
  logger.success(finishMsg)
  exitWithTime(start, 0) // 正常完成时调用，统一退出
}
