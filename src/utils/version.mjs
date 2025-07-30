import fsSync from 'fs'
// for sync version
import fs from 'fs/promises'

// for async version

/**
 * 同步读取 package.json 版本号
 * 兼容 Windows 和各种路径
 * @returns {string} 版本号字符串，读取失败返回 'unknow'
 */
export const getVersionSync = (packagePaths) => {
  for (const pkgPath of packagePaths) {
    try {
      const content = fsSync.readFileSync(pkgPath, 'utf8')
      const pkg = JSON.parse(content)
      if (pkg.version) {
        return pkg.version
      }
    } catch {
      // 继续尝试下一个路径
    }
  }

  return 'unknow'
}

/**
 * 异步读取 package.json 版本号
 * 兼容 Windows 和各种路径
 * @returns string 版本号字符串，读取失败返回 'unknow'
 */
export const getVersion = async (packagePaths) => {
  for (const pkgPath of packagePaths) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const content = await fs.readFile(pkgPath, 'utf8')
      const pkg = JSON.parse(content)
      if (pkg.version) {
        return pkg.version
      }
    } catch (e) {
      // console.log('e', e)
      // 继续尝试下一个路径
    }
  }

  return ' unknow'
}
