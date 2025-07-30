import chalk from 'chalk'

import { getLang } from './langDetect.mjs'

const messages = {
  zh: {
    cancelDeploy: '🚪 已取消部署。',
    cancelInit: '🚪 已取消初始化。',
    notInitialized: '❌ 项目未初始化，请先执行：wukong-deploy init',
    noServers: '⚠️ 未找到任何服务器配置，请先执行 wukong-deploy init 初始化',
    serverList: '\n📋 服务器列表：',
    serverFound: (name, host) => `\n🖥️  ${name} (${host})\n   部署命令：`,
    commandDesc: (idx, desc, cmd) => `   ${idx}. ${desc}: ${cmd}`,
    getServerListFail: (msg) => `❌ 获取服务器列表失败: ${msg}`,
    initError: (msg) => `初始化错误: ${msg}`,
    deployError: (msg) => `❌ 部署过程中出错: ${msg}`,
    configFileNotExist: (file) => `配置文件不存在: ${file}`,
    configNoServers: '配置文件中没有servers对象',
    configLoadFail: (msg) => `加载配置文件失败: ${msg}`,
    checkConfig: '\n请检查配置文件config.mjs\n',
    envFileNotExist: (file) => `环境文件不存在: ${file}`,
    configFormatError: '❌ 配置文件格式错误，缺少 default.servers 对象',
    configKeyNotFound: (key) => `❌ 配置中找不到服务器 key: ${key}`,
    needKeyOrPwd: '❌ 请配置私钥或密码环境变量',
    foundServer: (name) => `找到服务器配置: ${name}`,
    buildFinished: '✅ Build finished',
    userCancel: '\n🚪 用户取消了部署（Ctrl+C）',
    filesExist: (files) => `\n⚠️  以下文件已存在：${files}`
  },
  en: {
    cancelDeploy: '🚪 Deploy cancelled.',
    cancelInit: '🚪 Init cancelled.',
    notInitialized:
      '❌ Project not initialized, please run: wukong-deploy init',
    noServers: '⚠️ No server config found, please run wukong-deploy init first',
    serverList: '\n📋 Server List:',
    serverFound: (name, host) => `\n🖥️  ${name} (${host})\n   Deploy commands:`,
    commandDesc: (idx, desc, cmd) => `   ${idx}. ${desc}: ${cmd}`,
    getServerListFail: (msg) => `❌ Failed to get server list: ${msg}`,
    initError: (msg) => `Init error: ${msg}`,
    deployError: (msg) => `❌ Deploy error: ${msg}`,
    configFileNotExist: (file) => `Config file not found: ${file}`,
    configNoServers: 'No servers object in config file',
    configLoadFail: (msg) => `Failed to load config: ${msg}`,
    checkConfig: '\nPlease check config.mjs\n',
    envFileNotExist: (file) => `Env file not found: ${file}`,
    configFormatError: '❌ Config file format error, missing default.servers',
    configKeyNotFound: (key) => `❌ Server key not found in config: ${key}`,
    needKeyOrPwd: '❌ Please configure private key or password env',
    foundServer: (name) => `Found server config: ${name}`,
    buildFinished: '✅ Build finished',
    userCancel: '\n🚪 User cancelled deploy (Ctrl+C)',
    filesExist: (files) => `\n⚠️  The following files already exist: ${files}`
  }
}

export function i18nLog(key, ...args) {
  const lang = getLang()
  const msgObj = messages[lang] || messages.en
  let msg = msgObj[key]
  if (typeof msg === 'function') {
    msg = msg(...args)
  }
  if (!msg) msg = key
  console.log(msg)
}

export function i18nError(key, ...args) {
  const lang = getLang()
  const msgObj = messages[lang] || messages.en
  let msg = msgObj[key]
  if (typeof msg === 'function') {
    msg = msg(...args)
  }
  if (!msg) msg = key
  console.error(chalk.red(msg))
}

export function i18nWarn(key, ...args) {
  const lang = getLang()
  const msgObj = messages[lang] || messages.en
  let msg = msgObj[key]
  if (typeof msg === 'function') {
    msg = msg(...args)
  }
  if (!msg) msg = key
  console.warn(chalk.yellow(msg))
}
