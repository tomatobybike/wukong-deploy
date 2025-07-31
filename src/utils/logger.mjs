// scripts/logger.mjs
import { Chalk } from 'chalk'
import { format } from 'date-fns'
import fs from 'fs-extra'
import path from 'node:path'
import process from 'node:process'
import stripAnsi from 'strip-ansi'

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

// 彩色前缀
const prefix = {
  info: chalk.cyan('ℹ'),
  success: chalk.green('✔'),
  error: chalk.red('✖'),
  warn: chalk.yellow('⚠'),
  debug: chalk.gray('➤')
}

// 时间戳 [HH:mm:ss]
// 短时间戳用于终端输出
const shortTimestamp = () =>
  chalk.dim(`[${new Date().toTimeString().slice(0, 8)}]`)

// 日志文件中用本地完整时间
const fullTimestamp = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')

// 默认日志路径：项目根目录 logs/yyyy-mm-dd.log
const getLogFilePath = async () => {
  const day = format(new Date(), 'yyyy-MM-dd')
  // 缓存起来文件的日志路径
  const shouldRecreate =
    cachedDay !== day || !cachedPath || !fs.existsSync(cachedPath)
  if (shouldRecreate) {
    cachedDay = day
    const logDir = path.resolve(process.cwd(), 'logs', day)
    const logPath = path.join(logDir, 'wukong.log')
    fs.ensureDirSync(logDir)
    fs.ensureFileSync(logPath)
    cachedPath = logPath
    return logPath
  }
}

// 写入日志（同步 + 追加）
const writeToFile = async (level, msg) => {
  const logPath = await getLogFilePath()
  const line = `[${fullTimestamp()}] [${level.toUpperCase()}] ${stripAnsi(msg)}\n`
  fs.appendFileSync(logPath, line, 'utf-8')
}

// 主函数工厂，支持 { write: true } 控制是否写文件
function createLogger(level, colorFn, outFn = console.log) {
  return (...args) => {
    // 检查最后一个参数是否是写文件选项对象 { write: true }
    let writeFile = false
    if (
      args.length &&
      typeof args[args.length - 1] === 'object' &&
      args[args.length - 1] !== null &&
      'write' in args[args.length - 1]
    ) {
      writeFile = args.pop().write === true
    }

    const msg = args.map(String).join(' ')
    const line = `${shortTimestamp()} ${colorFn(prefix[level])} ${msg}`
    outFn(line)

    if (writeFile) {
      writeToFile(level, msg)
    }
  }
}

export const logger = {
  info: createLogger('info', chalk.cyan),
  success: createLogger('success', chalk.green),
  error: createLogger('error', chalk.red, console.error),
  warn: createLogger('warn', chalk.yellow, console.warn),
  debug: (msg, options = {}) => {
    if (process.env.DEBUG || process.env.WUKONG_DEBUG) {
      const line = `${shortTimestamp()} ${chalk.gray(prefix.debug)} ${msg}`
      console.log(line)
      if (options.write) {
        writeToFile('debug', [msg])
      }
    }
  }
}

export default logger
