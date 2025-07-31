import { Chalk } from 'chalk'
import { performance } from 'perf_hooks'

// 强制开启 truecolor chalk v5
import { costTimer } from './timer.mjs'

const chalk = new Chalk({ level: 3 }) // 强制开启 truecolor chalk v5

// 退出前打印耗时并退出
export const exitWithTime = (start, exitCode = 0) => {
  const end = performance.now()
  const timeMsg = costTimer(start, end)
  console.log(chalk.green(`\n${timeMsg}\n`))
  process.exit(exitCode)
}
