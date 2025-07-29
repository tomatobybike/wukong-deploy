import chalk from 'chalk'

// 自定义灰色，适合透明和深色背景，避免看不清
const betterGray = chalk.hex('#BBBBBB')

// 统一颜色模块
export const colors = {
  // 标题、版本号
  title: chalk.bold.cyan,

  // 命令名
  command: chalk.green,

  // 选项标记
  option: chalk.magenta,

  // 描述文字，替代默认灰色
  desc: betterGray,

  // Usage、Commands、Options、示例等小标题
  header: chalk.yellow,

  // 示例文字，普通白色
  example: chalk.white,

  // 警告红色
  error: chalk.bold.red,

  // 成功绿色
  success: chalk.bold.green,

  // 信息蓝色
  info: chalk.blue,

  // 可用更柔和的调暗白色，替代 dim gray
  dim: chalk.white.dim
}
