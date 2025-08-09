import fs from 'fs'
import os from 'os'
import path from 'path'
import updateNotifier from 'update-notifier'

const CONFIG_DIR = path.join(os.homedir(), '.config', 'configstore')
const getCacheFile = (pkg) => {
  return path.join(CONFIG_DIR, `update-notifier-${pkg.name}.json`)
}

/**
 * 检查更新（带缓存 + 官方样式）
 * @param {Object} options
 * @param {number} [options.interval=86400000] 缓存有效期，默认 24 小时
 * @param {boolean} [options.force=false] 是否强制忽略缓存立即检查
 */
export async function checkUpdateWithPatch({
  interval = 24 * 60 * 60 * 1000,
  force = false,
  pkg
} = {}) {
  const now = Date.now()
  const CACHE_FILE = getCacheFile(pkg)
  let cache = {}
  if (fs.existsSync(CACHE_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) || {}
    } catch {}
  }

  // 缓存未过期 且 不是强制模式 -> 跳过
  if (!force && cache.lastCheck && now - cache.lastCheck < interval) {
    console.log('未过期，不检查更新')
    return null
  }

  // 使用官方 update-notifier 检查
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 })
  console.log('notifier', notifier)
  if (notifier.update) {
    // 保存到缓存
    try {
      fs.mkdirSync(CONFIG_DIR, { recursive: true })
      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(
          {
            lastCheck: now,
            updateInfo: notifier.update
          },
          null,
          2
        )
      )
    } catch (e) {
      console.error('缓存写入失败:', e)
    }

    // 官方样式提示
    notifier.notify()
    return notifier.update
  }

  // 无更新时也更新缓存时间
  try {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ lastCheck: now }, null, 2))
  } catch (e) {
    console.error('缓存写入失败:', e)
  }

  return null
}
