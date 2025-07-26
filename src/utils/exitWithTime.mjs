import { performance } from 'perf_hooks'

import chalk from 'chalk'


import { costTimer } from './timer.mjs'

// 退出前打印耗时并退出
export const exitWithTime = (start, exitCode = 0) => {
  const end = performance.now()
  const timeMsg = costTimer(start, end)
  console.log(chalk.green(`\n${timeMsg}\n`))
  process.exit(exitCode)
}
