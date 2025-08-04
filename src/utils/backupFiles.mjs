/**
 * @file: backupFiles.mjs
 * @description: 专注备份逻辑
 * @author: King Monkey
 * @created: 2025-08-05 00:04
 */
import { format } from 'date-fns'
import fs from 'fs-extra'
import path from 'path'

import { devLog } from './devLog.mjs'
import { i18nLogNative } from './i18n.mjs'

const rootDir = process.cwd()

export async function backupFiles(configPath, envPath) {
  if (!configPath || !envPath) {
    throw new Error('Missing paths')
  }

  const configExists = fs.existsSync(configPath)
  const envExists = fs.existsSync(envPath)

  if (!configExists && !envExists) {
    i18nLogNative('backup.noFilesToBackup')
    return false
  }

  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss')
  const backupDir = path.join(rootDir, 'backup', timestamp)

  await fs.ensureDir(backupDir)
  const backedUp = []

  if (await fs.pathExists(configPath)) {
    await fs.copy(configPath, path.join(backupDir, 'config.mjs'))
    backedUp.push('config/config.mjs')
  }

  if (await fs.pathExists(envPath)) {
    await fs.copy(envPath, path.join(backupDir, '.env'))
    backedUp.push('.env')
  }

  devLog(`📦 备份成功：${backedUp.join(', ')} → ${backupDir}`)
  i18nLogNative('backup.backupSuccess', { files: backedUp.join(', '), dir: backupDir })
  return true
}
