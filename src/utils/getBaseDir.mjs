// src/utils/getBaseDir.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

/**
 * 获取项目根路径
 * - 开发环境返回项目根（含有 package.json）
 * - 打包后在 bin/ 运行，也会 fallback 到 bin/
 */
export function getProjectRoot() {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const current = path.dirname(__filename)

    // 向上查找 package.json 来确定根目录（适配 dev / prod）
    let dir = current
    while (!fs.existsSync(path.join(dir, 'package.json'))) {
      const parent = path.dirname(dir)
      if (parent === dir) break // 到了根目录
      dir = parent
    }

    return dir
  } catch {
    // fallback 打包后 __dirname 仍然可用
    return typeof __dirname !== 'undefined' ? __dirname : process.cwd()
  }
}
