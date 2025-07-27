import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'node:path'

import { devLog } from './utils/devLog.mjs'
import { pathToFileUrl } from './utils/pathToFileUrl.mjs'

const rootDir = process.cwd()
// 使用path.join确保跨平台兼容性
const configFile = path.resolve(rootDir, path.join('config', 'config.mjs'))

// 调试信息
devLog(`配置加载器 - 工作目录: ${rootDir}`)
devLog(`配置加载器 - 配置文件路径: ${configFile}`)

export async function getServerList() {
  // 检查配置文件是否存在
  if (!(await fs.pathExists(configFile))) {
    console.error(`配置文件不存在: ${configFile}`)
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
      console.error('配置文件中没有servers对象')
      return []
    }

    const serverList = Object.entries(servers).map(([key, value]) => ({
      key, // 'test'、'dev'、'prod'
      ...value // name, host, ...
    }))

    devLog(`找到${serverList.length}个服务器配置`)

    return serverList || []
  } catch (error) {
    console.error(`加载配置文件失败: ${error.message}`)
    console.log(chalk.red('\n请检查配置文件config.mjs\n'))
    process.exit(1)
    // console.error(error.stack)
    // return []
  }
}
