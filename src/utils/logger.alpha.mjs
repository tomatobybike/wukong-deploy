import { Chalk } from 'chalk'
// 强制开启 truecolor chalk v5
import { format } from 'date-fns'
import fs from 'fs-extra'
import path from 'path'
import stripAnsi from 'strip-ansi'

const chalk = new Chalk({ level: 3 }) // 强制开启 truecolor chalk v5

// 使用用户当前工作目录而不是包安装目录
const rootDir = process.cwd()

// 每天一个子目录，如 logs/2025-07-26/deploy.log
const logDir = path.resolve(rootDir, 'logs', format(new Date(), 'yyyy-MM-dd'))
const logPath = path.join(logDir, 'deploy.log')

// 确保目录和文件存在
await fs.ensureDir(logDir)
await fs.ensureFile(logPath)

function getTimestamp() {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

function write(msg) {
  const timestamp = getTimestamp()
  const clean = `[${timestamp}] ${stripAnsi(msg)}`
  fs.appendFileSync(logPath, `${clean}\n`, 'utf-8')
}

const logger = {
  info: (msg) => {
    const line = chalk.blue('[INFO] ') + msg
    console.log(line)
    write(line)
  },
  success: (msg) => {
    const line = chalk.green('[SUCCESS] ') + msg
    console.log(line)
    write(line)
  },
  error: (msg) => {
    const line = chalk.red('[ERROR] ') + msg
    console.error(line)
    write(line)
  }
}

export default logger
