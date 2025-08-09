/**
 * @file: checkUpdate.mjs
 * @description: 自定义 CLI 更新检查，支持所有版本更新类型，带缓存 & 超时控制
 * @author: King Monkey
 * @created: 2025-08-09
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import boxen from 'boxen'
import { Chalk } from 'chalk'
import isOnline from 'is-online'
import semver from 'semver'

const chalk = new Chalk({ level: 3 }) // 强制开启 Truecolor

// 缓存文件路径（跨平台）
const CACHE_FILE = path.join(os.homedir(), '.config', 'wukong-deploy-update.json')

// 默认检查间隔（1 天）
const DEFAULT_INTERVAL =  6* 1000 // 1000 * 60 * 60 * 24

// ====== 工具函数 ======
function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeCache(data) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data), 'utf8')
  } catch {
    // 忽略写入错误
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    // eslint-disable-next-line no-promise-executor-return
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ])
}

async function getLatestVersion(pkgName) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkgName}/latest`, {
      timeout: 2000 // 2秒超时
    })
    if (!res.ok) throw new Error('fetch fail')
    const data = await res.json()
    return data.version
  } catch {
    return null
  }
}

// ====== 主检查逻辑 ======
export async function checkUpdate(pkg, interval = DEFAULT_INTERVAL) {
  const cache = readCache()
  const now = Date.now()

  console.log('cache', cache)
  // 如果缓存里有结果且未过期
  if (cache.lastCheck && now - cache.lastCheck < interval) {
    console.log('未过期')
    return  null
  }

  // 在线检测
  const online = await withTimeout(isOnline(), 1000).catch(() => false)
  if (!online) return null

  const latest = await getLatestVersion(pkg.name)
  if (!latest) return null

  if (semver.lt(pkg.version, latest)) {
    const updateInfo = {
      current: pkg.version,
      latest,
      type: semver.diff(pkg.version, latest),
      name: pkg.name
    }
    // 缓存结果
    writeCache({ lastCheck: now, updateInfo })
    return updateInfo
  }

  // 没更新则清空缓存
  writeCache({ lastCheck: now })
  return null
}

// ====== 提示信息 ======
export function formatUpdateMessage(current, latest, name) {
  const arrow = chalk.gray('→')
  const currentVer = chalk.red(current)
  const latestVer = chalk.green(latest)
  const nameStr = chalk.cyan(name)

  const message =
    `${chalk.bold('有新版本可用！')}\n` +
    `  ${nameStr}  ${currentVer} ${arrow} ${latestVer}\n\n` +
    `${chalk.gray('运行')} ${chalk.yellow(`npm i -g ${name}`)} ${chalk.gray('来更新')}`

  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow'
  })
}
