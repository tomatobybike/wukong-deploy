/**
 * @file: updateNotifier.mjs
 * @description:
 * @author: King Monkey
 *
  update-notifier 默认只对次版本及主版本变化才通知

  需要检测补丁版本，可以用 semver 比较并强制调用 notify()

  你的 1.2.12 < 1.2.22 是补丁版本更新，所以默认不通知

 * @created: 2025-08-09 10:25
 */
import semver from 'semver'
import updateNotifier from 'update-notifier'

/*
rm ~/.config/configstore/update-notifier-wukong-deploy.json
*/
const pkg = {
  name: 'wukong-deploy',
  version: '1.0.12' // 模拟旧版本
}

const notifier = updateNotifier({
  pkg,
  // 这里也可以自定义 updateCheckInterval: 0 让每次都检查
  updateCheckInterval: 0
})
console.log('Cache file:', notifier.config.path)
if (notifier.update) {
  // 手动判断是否补丁版本更新也要通知
  if (semver.lt(pkg.version, notifier.update.latest)) {
    notifier.notify()
    console.log('aaa')
  } else {
    console.log('已经是最新版本')
  }
} else {
  console.log('已经是最新版本')
}
