import chalk from 'chalk'

export const costTimer = (startTime, endTime) => {
  if (typeof startTime !== 'number' || typeof endTime !== 'number') {
    console.error(
      chalk.red.bold('Error: startTime and endTime must be numbers.')
    )
    return
  }

  const durationMs = endTime - startTime // 时间差（以毫秒为单位）
  if (durationMs < 0) {
    console.error(
      chalk.red.bold('Error: endTime must be greater than startTime.')
    )
    return
  }

  const costSeconds = durationMs / 1000 // 转换为秒
  const costMin = costSeconds / 60 // 转换为分钟
  const costHour = costMin / 60 // 转换为小时

  let displayTime = ''
  if (costSeconds < 60) {
    displayTime = `${costSeconds.toFixed(2)} seconds`
  } else if (costMin < 60) {
    displayTime = `${costMin.toFixed(3)} minutes`
  } else {
    displayTime = `${costHour.toFixed(3)} hours`
  }



  return `⏱ Execution time: ${displayTime}`
}
