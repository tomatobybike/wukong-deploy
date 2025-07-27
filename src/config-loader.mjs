import fs from 'fs-extra'
import path from 'node:path'

import { pathToFileUrl } from './utils/pathToFileUrl.mjs'

const isDev = process.env.DEV_MODE === '1'
const rootDir = process.cwd()
// 使用path.join确保跨平台兼容性
const configFile = path.resolve(rootDir, path.join('config', 'config.mjs'))

// 调试信息
if (isDev) {
  console.log(`配置加载器 - 工作目录: ${rootDir}`)
  console.log(`配置加载器 - 配置文件路径: ${configFile}`)
}

export async function getServerList() {
  // 检查配置文件是否存在
  if (!(await fs.pathExists(configFile))) {
    console.error(`配置文件不存在: ${configFile}`)
    return []
  }

  try {
    if (isDev) {
      console.log(`尝试导入配置文件: ${configFile}`)
    }

    // 将路径转换为URL格式，确保Windows兼容性
    const configFileUrl = pathToFileUrl(configFile)
    if (isDev) {
      console.log(`配置文件URL: ${configFileUrl}`)
    }

    const config = await import(configFileUrl)
    const { servers } = config.default || {}

    if (!servers) {
      console.error('配置文件中没有servers对象')
      return []
    }

    const serverList = Object.entries(servers).map(([key, value]) => ({
      key, // 'test'、'dev'、'prod'
      ...value // name, host, ...
    }))

    if (isDev) {
      console.log(`找到${serverList.length}个服务器配置`)
    }

    return serverList || []
  } catch (error) {
    console.error(`加载配置文件失败: ${error.message}`)
    console.error(error.stack)
    return []
  }
}
