import { colors } from './colors.mjs'

export function printHelp({
  version,
  description,
  commands = [],
  options = [],
  examples = [],
  cliName = 'wukong-deploy' // 新增默认参数
}) {
  const pad = (str, len) => str + ' '.repeat(Math.max(0, len - str.length))
  const getMaxLength = (items, key) =>
    Math.max(...items.map((item) => item[key]?.length || 0), 10)

  const maxCmdLen = getMaxLength(commands, 'name')
  const maxOptLen = getMaxLength(options, 'flags')

  console.log(colors.title(`\n${cliName} v${version}`))
  if (description) console.log(`  ${colors.desc(description)}\n`)

  console.log(colors.header('Usage:'))
  console.log(
    `  ${colors.command(cliName)} ${colors.desc('[command] [options]')}\n`
  )

  if (commands.length) {
    console.log(colors.header('Commands:'))
    for (const cmd of commands) {
      console.log(
        `  ${colors.command(pad(cmd.name, maxCmdLen))}  ${colors.desc(cmd.desc)}`
      )

      if (cmd.subcommands?.length) {
        for (const sub of cmd.subcommands) {
          const prefix = '    └── '
          console.log(
            `${colors.desc(prefix)}${colors.command(pad(sub.name, maxCmdLen - 2))}  ${colors.desc(sub.desc)}`
          )
        }
      }
    }
    console.log()
  }

  if (options.length) {
    console.log(colors.header('Options:'))
    for (const opt of options) {
      console.log(
        `  ${colors.option(pad(opt.flags, maxOptLen))}  ${colors.desc(opt.desc)}`
      )
    }
    console.log()
  }

  if (examples.length) {
    console.log(colors.header('示例:'))
    for (const ex of examples) {
      // 这里把示例中的默认命令名替换成cliName，方便灵活
      const exampleLine = ex.replace(/wukong-deploy/g, cliName)
      console.log(`  ${colors.example(exampleLine)}`)
    }
    console.log()
  }
}

// 无参打印帮助
export const printHelp2 = async (version) => {
  console.log(`
wukong-deploy v${version}
  A tool for deploying applications to remote servers.

Usage:
  wukong-deploy [command] [options]

Commands:
  init               初始化配置
  list               显示所有可部署的服务器及其部署命令
  deploy             根据提示选择服务器进行部署
  deploy [server]    部署指定服务器

Options:
  -v, --version      显示版本号
  -h, --help         显示帮助信息
  -f, --force        在 init 时强制覆盖已有配置文件

示例:
  wukong-deploy init
  wukong-deploy list
  wukong-deploy deploy
  wukong-deploy deploy prod
  wukong-deploy -v
`)
}
