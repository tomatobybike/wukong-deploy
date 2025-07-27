// 无参打印帮助
export const printHelp = async (version) => {
  console.log(`
wukong-deploy v${version}
  A tool for deploying applications to remote servers.

Usage:
  wukong-deploy [command] [options]

Commands:
  init               初始化配置
  deploy             根据提示选择服务器进行部署
  deploy [server]    部署指定服务器

Options:
  -v, --version      显示版本号
  -h, --help         显示帮助信息

示例:
  wukong-deploy init
  wukong-deploy deploy
  wukong-deploy deploy prod
  wukong-deploy -v
`)
}
