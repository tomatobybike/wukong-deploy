/**
 * @file: logger.mjs
 * @description:
 *  避免了 Windows 上查看日志文件中文乱码
 *  使用 stripAnsi(msg) 过滤终端颜色代码
 *  prefix 使用 emoji，也兼容终端彩色输出
 *
 *  在日志文件首次创建时：
    写入了 UTF-8 的 BOM（Byte Order Mark）
    让 Windows 系统（尤其是旧版记事本）自动识别为 UTF-8 编码
 * @author: King Monkey
 * @created: 2025-08-02 11:59
 */
// scripts/logger.mjs
import { Chalk } from 'chalk'
import { format } from 'date-fns'
import fs from 'fs-extra'
import path from 'node:path'
import process from 'node:process'
import stripAnsi from 'strip-ansi'

import { e } from './emoji.mjs'

const chalk = new Chalk({ level: 3 }) // 强制开启 truecolor chalk v5

// 💡 自动启用颜色，即使 isTTY 无效（Git Bash、CI 等） chalk v4
/*
if (!process.stdout.isTTY || chalk.level === 0) {
  chalk.level = 3
}
 */

// 缓存起来文件的日志路径
let cachedDay = ''
let cachedPath = ''

// // 彩色前缀
// const prefix = {
//   info: chalk.cyan('ℹ'),
//   success: chalk.green('✔'),
//   error: chalk.red('✖'),
//   warn: chalk.yellow('⚠'),
//   debug: chalk.gray('➤')
// }

// 🔧 1. 修改 prefix：只保留 emoji，不带颜色
const prefix = {
  info: e('➤', '[i]'),
  success: e('✔', '[✓]'),
  error: e('✖', '[x]'),
  warn: e('⚠', '[!]'),
  debug: e('➤', '->')
}

// 时间戳 [HH:mm:ss]
// 短时间戳用于终端输出
const shortTimestamp = () =>
  chalk.dim(`[${new Date().toTimeString().slice(0, 8)}]`)

// 日志文件中用本地完整时间
const fullTimestamp = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')

// 默认日志路径：项目根目录 logs/yyyy-mm-dd.log
const getLogFilePath = () => {
  const day = format(new Date(), 'yyyy-MM-dd')
  // 缓存起来文件的日志路径
  const shouldRecreate =
    cachedDay !== day || !cachedPath || !fs.existsSync(cachedPath)
  if (shouldRecreate) {
    cachedDay = day
    const logDir = path.resolve(process.cwd(), 'logs', day)
    const logPath = path.join(logDir, 'wukong.log')
    fs.ensureDirSync(logDir)
    /*
    在日志文件首次创建时：

    写入了 UTF-8 的 BOM（Byte Order Mark）

    让 Windows 系统（尤其是旧版记事本）自动识别为 UTF-8 编码
    */
    if (!fs.existsSync(logPath)) {
      fs.ensureFileSync(logPath)
      fs.writeFileSync(logPath, '\uFEFF', { encoding: 'utf-8' }) // 添加 BOM
    }

    cachedPath = logPath
    return logPath
  }
  return cachedPath
}

// 写入日志（同步 + 追加）
const writeToFile = (level, msg, newline) => {
  const logPath = getLogFilePath()
  if (!logPath) {
    console.error('❌ 日志路径未生成，终止写入')
    return
  }
  const newLineString = newline ? '\n' : ''
  const line = `${newLineString}[${fullTimestamp()}] [${level.toUpperCase()}] ${stripAnsi(msg)}\n`
  fs.appendFileSync(logPath, line, 'utf-8')
}

// 主函数工厂，支持 { write: true } 控制是否写文件
function createLogger(level, colorFn, outFn = console.log) {
  return (...args) => {
    if (level === 'debug' && !(process.env.DEBUG || process.env.WUKONG_DEBUG)) {
      return
    }

    let options = {}
    if (
      args.length &&
      typeof args[args.length - 1] === 'object' &&
      args[args.length - 1] !== null &&
      ('write' in args[args.length - 1] || 'newline' in args[args.length - 1])
    ) {
      options = args.pop()
    }

    const msg = args
      .map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      )
      .join(' ')

    // 🔧 2. 修改拼接方式，colorFn 统一处理 prefix + msg
    const line = `${shortTimestamp()} ${colorFn(`${prefix[level]} ${msg}`)}`

    if (options.newline) {
      outFn('')
    }
    outFn(line)

    if (options.write) {
      writeToFile(level, msg, options.newline)
    }
  }
}

export const logger = {
  info: createLogger('info', chalk.cyan),
  success: createLogger('success', chalk.green),
  error: createLogger('error', chalk.red, console.error),
  warn: createLogger('warn', chalk.yellow, console.warn),
  debug: createLogger('debug', chalk.white)
}

export default logger
