/* eslint-disable no-template-curly-in-string */
import { getLang } from './langDetect.mjs'
import logger from './logger.mjs'

const logCache = { write: true }
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
    filesExist: (files) => `\n⚠️  以下文件已存在：${files}`,
    file: {
      confirmOverwrite: '是否要覆盖现有文件？',
      overwriting: '正在覆盖文件...'
    },
    init: {
      starting: '正在初始化配置...',
      success: '初始化完成 ✅',
      failure: '初始化失败',
      errorMessage: (msg) => `初始化错误: ${msg}`
    },
    deploy: {
      selectTarget: '请选择要部署的服务器',
      cancelOption: '❌ 退出部署',
      cancelDeploy: '已取消部署',
      notFound: '❌ 未找到指定的服务器配置,请检查配置文件是否正确',
      hintListCommand: 'use: wukong-deploy list \n 查看所有服务器配置',
      executingOnServer: (name, host) =>
        `📋 即将在 ${name} (${host}) 执行以下命令：`,
      commandConfirm: '确认要执行这些命令吗？',
      importConfigFail: (msg) => `❌ 导入配置文件失败: ${msg}`,
      deployComplete: (msg) => `🚀 部署 ${msg} 完成`
    },
    sshConnectSuccess: '✅ SSH 连接成功',
    sshConnectFail: (msg) => `❌ SSH 连接失败：${msg}`,
    execCommand: (cmd, desc) => `💻 执行命令：${cmd} ${desc}`,
    prompt: {
      cancelInit: '🚪 用户取消了初始化（Ctrl+C）'
    },

    command: {
      exitCodeNotZero: '🔴 命令 "${cmd}" 退出码非 0：${code}',
      stderrTreatedAsError: '🔴 命令 "${cmd}" 输出错误信息（stderr）被视为失败',
      matchedErrorPattern: '🔴 命令 "${cmd}" 匹配到错误模式：${pattern}',
      commandFailed: '❌ 命令失败：${desc}'
    }
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
    filesExist: (files) => `\n⚠️  The following files already exist: ${files}`,
    file: {
      confirmOverwrite: 'Do you want to overwrite the existing file?',
      overwriting: 'Overwriting files...'
    },
    init: {
      starting: 'Initializing configuration...',
      success: 'Initialization complete ✅',
      failure: 'Initialization failed',
      errorMessage: (msg) => `Initialization error: ${msg}`
    },
    deploy: {
      selectTarget: 'Please select the server to deploy',
      cancelOption: '❌ Cancel deployment',
      cancelDeploy: 'Deployment cancelled',
      notFound: '❌ Server config not found. Please check your config file.',
      hintListCommand: 'use: wukong-deploy list \n to see all server configs',
      executingOnServer: (name, host) =>
        `\n📋 Will execute the following commands on ${name} (${host}):`,
      commandConfirm: 'Confirm to execute these commands?',
      importConfigFail: (msg) => `❌ Failed to import config file: ${msg} `,

      deployComplete: (msg) => `🚀 Deployment to ${msg} completed`
    },
    sshConnectSuccess: '✅ SSH connection successful',
    sshConnectFail: (msg) => `❌ SSH connection failed: ${msg}`,
    execCommand: (cmd, desc) => `💻 Executing command: ${cmd} ${desc}`,
    prompt: {
      cancelInit: '🚪 User cancelled initialization (Ctrl+C)'
    },
    command: {
      exitCodeNotZero: '🔴 Command "${cmd}" exited with non-zero code: ${code}',
      stderrTreatedAsError:
        '🔴 Command "${cmd}" stderr output is treated as failure',
      matchedErrorPattern:
        '🔴 Command "${cmd}" matched error pattern: ${pattern}',
      commandFailed: '❌ Command failed: ${desc}'
    }
  }
}
function getNestedMessage(obj, path) {
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj)
}

function formatTemplate(template, vars = {}) {
  return template.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}

function resolveMessage(key, args) {
  const lang = getLang()
  const msgObj = messages[lang] || messages.en
  let msg = getNestedMessage(msgObj, key)

  // 如果是函数：支持 args 是数组或对象
  if (typeof msg === 'function') {
    if (Array.isArray(args)) {
      msg = msg(...args)
    } else if (typeof args === 'object') {
      msg = msg(...Object.values(args))
    }
  } else if (typeof msg === 'string') {
    if (typeof args === 'object') {
      msg = formatTemplate(msg, args)
    }
  }

  return msg || key
}

export function i18nInfo(key, args) {
  logger.info(resolveMessage(key, args), logCache)
}
export function i18nSuccess(key, args) {
  logger.success(resolveMessage(key, args), logCache)
}
export function i18nWarn(key, args) {
  logger.warn(resolveMessage(key, args), logCache)
}
export function i18nError(key, args = {}) {
  logger.error(resolveMessage(key, args), logCache)
}
export function i18nGetRaw(key, args = {}) {
  return resolveMessage(key, args)
}
export function i18nLogNative(key, args = {}) {
  console.log(resolveMessage(key, args))
}
