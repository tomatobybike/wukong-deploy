/**
 * @file: checkUpdate.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-09 12:14
 */
import boxen from 'boxen'
import { Chalk } from 'chalk'
import isOnline from 'is-online'
import semver from 'semver'
import updateNotifier from 'update-notifier'

const chalk = new Chalk({ level: 3 }) // 强制开启 truecolor chalk v5

function shouldCheck(notifier, interval) {
  const now = Date.now()
  const lastCheck = notifier.config.get('lastUpdateCheck') || 0
  if (now - lastCheck > interval) {
    notifier.config.set('lastUpdateCheck', now)
    return true
  }
  return false
}

/**
 * 带超时的 Promise 封装
 * ====== 非阻塞更新检查 ======
 */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      // eslint-disable-next-line no-promise-executor-return
      setTimeout(() => reject(new Error('timeout')), ms)
    )
  ])
}

export async function getLatestVersion(pkgName) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkgName}/latest`, {
      timeout: 1000
    })
    if (!res.ok) throw new Error('fetch fail')
    const data = await res.json()
    return data.version
  } catch {
    return null
  }
}

/**
 * 检查更新，返回类似 updateNotifier.update 的对象或 null
 */
export async function checkUpdateSelf(pkg) {
  try {
    const online = await withTimeout(isOnline(), 500)
    if (!online) return null

    const latest = await getLatestVersion(pkg.name)
    if (!latest) return null

    const hasNewVer = semver.lt(pkg.version, latest)
    if (!hasNewVer) return null

    // 构造类似 updateNotifier.update 的结构
    return {
      current: pkg.version,
      latest,
      type: semver.diff(pkg.version, latest),
      name: pkg.name
    }
  } catch (e) {
    // 可以加日志：console.error('checkUpdate error:', e)
    return null
  }
}

/**
 * 检查更新并使用 update-notifier 的缓存与通知功能
 */
export async function checkUpdateWithPatch(pkg, updateCheckInterval = 1000 * 60 * 60 * 24) {
  try {
    const online = await isOnline()
    if (!online) return null

    const notifier = updateNotifier({ pkg })
    const needCheck = shouldCheck(notifier, updateCheckInterval)

    // 如果不需要检查，直接用缓存里的 update 信息
    const cachedUpdate = notifier.config.get('update')
    if (!needCheck && cachedUpdate) {
      return cachedUpdate
    }

    // 需要检查，直接自己请求 npm 最新版本
    const latest = await getLatestVersion(pkg.name)
    if (!latest) return null

    if (semver.lt(pkg.version, latest)) {
      const updateInfo = {
        current: pkg.version,
        latest,
        type: semver.diff(pkg.version, latest),
        name: pkg.name
      }
      // 写入缓存
      notifier.config.set('update', updateInfo)
      return updateInfo
    }

    // 没有新版本就清空缓存
    notifier.config.delete('update')
    return null
  } catch {
    return null
  }
}

/**
 * 格式化升级提示信息
 */
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
