/**
 * @file: wukong-deploy/src/init.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-02 01:49
 */

import fs from 'fs-extra'
import path from 'path'

import {
  generateConfigContent,
  generateConfigPasswordContent
} from './generateConfig.mjs'
import { devLog } from './utils/devLog.mjs'
import { i18nLogNative ,i18nGetRaw} from './utils/i18n.mjs'
import { getLang } from './utils/langDetect.mjs'
import { promptWithSpinnerStop } from './utils/promptWithSpinnerStop.mjs'

const rootDir = process.cwd()


const forceOverwrite =
  process.argv.includes('--force') || process.argv.includes('-f')

export default async function init(spinner) {

  const lang = getLang()
  // 调试信息，帮助排查Windows问题

  devLog(`当前工作目录: ${rootDir}`)

  // 使用path.join确保跨平台兼容性
  const configPath = path.resolve(rootDir, path.join('config', 'config.mjs'))
  const envPath = path.resolve(rootDir, '.env')

  // 打印路径信息
  devLog(`配置文件路径: ${configPath}`)
  devLog(`环境文件路径: ${envPath}`)

  // 检查文件是否存在
  const configExists = await fs.pathExists(configPath)
  const envExists = await fs.pathExists(envPath)

  // 如果文件存在且没有强制覆盖参数，则询问用户
  if ((configExists || envExists) && !forceOverwrite) {
    const existingFiles = []
    if (configExists) existingFiles.push('config/config.mjs')
    if (envExists) existingFiles.push('.env')
    spinner.stop()


    i18nLogNative('filesExist', { files: existingFiles.join(', ') })

    const { overwrite } = await promptWithSpinnerStop(spinner, [
      {
        type: 'confirm',
        name: 'overwrite',
        message: i18nGetRaw('file.confirmOverwrite'),
        default: false
      }
    ])

    if (!overwrite) {
      i18nLogNative('cancelInit')
      process.exit(1)
      return
    }
  }
  spinner.start('正在覆盖文件...')
  // 确保目录存在，并打印调试信息
  const configDir = path.dirname(configPath)
  devLog(`创建配置目录: ${configDir}`)

  await fs.ensureDir(configDir)
  devLog(`写入配置文件: ${configPath}`)

  const configContent = generateConfigContent(lang)

  await fs.writeFile(configPath, configContent)

  devLog(`写入环境文件: ${envPath}`)

  const configPasswordContent = generateConfigPasswordContent(lang)

  await fs.writeFile(envPath, configPasswordContent)

  // 验证文件是否成功创建
  const configCreated = await fs.pathExists(configPath)
  const envCreated = await fs.pathExists(envPath)

  devLog(`配置文件创建状态: ${configCreated ? '成功' : '失败'}`)
  devLog(`环境文件创建状态: ${envCreated ? '成功' : '失败'}`)

  devLog(`✅ 已生成 ${configPath} 和 ${envPath} 文件`)
}
