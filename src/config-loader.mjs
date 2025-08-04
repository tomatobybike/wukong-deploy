/**
 * @file: config-loader.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-01 15:00
 */
import fs from 'fs-extra'
import path from 'node:path'

import { devLog } from './utils/devLog.mjs'
import { i18nError } from './utils/i18n.mjs'
import { pathToFileUrl } from './utils/pathToFileUrl.mjs'

const rootDir = process.cwd()
// 使用path.join确保跨平台兼容性
const configFile = path.resolve(rootDir, path.join('config', 'config.mjs'))
const configEnvFile = path.resolve(rootDir, path.join('.env'))

// 调试信息
devLog(`工作目录: ${rootDir}`)
devLog(`配置文件路径: ${configFile}`)
devLog(`配置文件路径.env: ${configEnvFile}`)

export async function getServerList() {
  // 检查配置文件是否存在
  if (!(await fs.pathExists(configFile))) {
    i18nError('configFileNotExist', { file: configFile })
    return []
  }

  try {
    devLog(`尝试导入配置文件: ${configFile}`)

    // 将路径转换为URL格式，确保Windows兼容性
    const configFileUrl = pathToFileUrl(configFile)
    devLog(`配置文件URL: ${configFileUrl}`)

    const config = await import(configFileUrl)
    const { servers } = config.default || {}

    if (!servers) {
      i18nError('configNoServers')

      return []
    }

    const serverList = Object.entries(servers).map(([key, value]) => ({
      key, // 'test'、'dev'、'prod'
      ...value // name, host, ...
    }))

    devLog(`找到${serverList.length}个服务器配置`)

    return serverList || []
  } catch (error) {
    // console.error(`加载配置文件失败: ${error.message}`)
    i18nError('configLoadFail', { msg: error.message })
    i18nError('checkConfig')
    process.exit(1)
    // console.error(error.stack)
    // return []
  }
}
