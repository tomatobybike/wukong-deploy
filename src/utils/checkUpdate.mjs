import boxen from 'boxen'
import fs from 'fs'
import isOnline from 'is-online'
import os from 'os'
import path from 'path'
import semver from 'semver'

import { colors } from './colors.mjs'

const CONFIG_DIR = path.join(os.homedir(), '.config', 'configstore')

const getCacheFile = (pkg) =>
  path.join(CONFIG_DIR, `update-notifier-${pkg.name}.json`)

async function fetchLatestVersion(pkgName, timeout = 1500) {
  const url = `https://registry.npmjs.org/${pkgName}/latest`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) throw new Error('fetch fail')
    const data = await res.json()
    return data.version
  } catch (e) {
    clearTimeout(timer)
    // 超时或其他错误都返回 null，防止程序卡死
    return null
  }
}

/**
 * 格式化升级提示信息
 */
export function formatUpdateMessage(current, latest, name) {
  const arrow = colors.dim('→')
  const currentVer = colors.dim(current)
  const latestVer = colors.green(latest)

  const message =
    `${colors.dim('Update available')}` +
    `  ${currentVer} ${arrow} ${latestVer}\n` +
    `${colors.dim('Run')} ${colors.cyanish(`npm i -g ${name}`)} ${colors.dim(' to update')}`

  return boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow'
  })
}

/**
 * 检查更新（带缓存 + 支持 patch 更新）
 */
export async function checkUpdateWithPatch({
  pkg,
  interval = 24 * 60 * 60 * 1000,
  // interval = 6 * 1000,
  force = false
} = {}) {
  const online = await isOnline()
  // console.log('online', online)
  if (!online) return null
  const now = Date.now()
  const CACHE_FILE = getCacheFile(pkg)

  let cache = {}
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) || {}
      // eslint-disable-next-line no-empty
    } catch {}
  }

  // console.log('now - cache.lastCheck', now - cache.lastCheck, interval)
  if (!force && cache.lastCheck && now - cache.lastCheck < interval) {
    return cache.updateInfo || null
  }

  const latest = await fetchLatestVersion(pkg.name)
  if (!latest) {
    // console.log('无法获取最新版本')
    return null
  }

  if (semver.lt(pkg.version, latest)) {
    // 构造 update 对象，兼容 update-notifier
    const updateInfo = {
      current: pkg.version,
      latest,
      type: semver.diff(pkg.version, latest) || 'patch',
      name: pkg.name,
      // 这里官方还会有 message 字段
      // 用官方的默认消息格式生成，方便notify打印
      message: `\nUpdate available ${pkg.version} → ${latest}\nRun npm i -g ${pkg.name} to update\n`
    }

    // 缓存
    try {
      fs.mkdirSync(CONFIG_DIR, { recursive: true })
      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(
          {
            lastCheck: now,
            updateInfo
          },
          null,
          2
        )
      )
    } catch (e) {
      console.error('缓存写入失败:', e)
    }

    const { current } = updateInfo
    console.log(formatUpdateMessage(current, latest, pkg.name))
    return updateInfo
  }
  // 无更新，刷新缓存时间
  try {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ lastCheck: now }, null, 2))
  } catch (e) {
    console.error('缓存写入失败:', e)
  }
  return null
}
