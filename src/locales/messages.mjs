import { e } from '../utils/emoji.mjs'

const messages = {
  zh: {
    cancelDeploy: `${e('🚪', '[退出]')} 已取消部署。`,
    cancelInit: `${e('🚪', '[退出]')} 已取消初始化。`,
    notInitialized: `${e('❌', '[错误]')} 项目未初始化，请先执行：wukong-deploy init`,
    noServers: `${e('⚠️', '[警告]')} 未找到任何服务器配置，请先执行 wukong-deploy init 初始化`,
    serverList: `\n${e('📋', '[列表]')} 服务器列表：`,
    serverFound: (name, host) =>
      `\n${e('🖥️', '[服务器]')} ${name} ${host}\n   部署命令：`,
    commandDesc: (idx, desc, cmd) => `   ${idx}. ${desc}: ${cmd}`,
    getServerListFail: (msg) =>
      `${e('❌', '[失败]')} 获取服务器列表失败: ${msg}`,
    initError: (msg) => `初始化错误: ${msg}`,
    deployError: (msg) => `${e('❌', '[失败]')} 部署过程中出错: ${msg}`,
    configFileNotExist: (file) => `配置文件不存在: ${file}`,
    configNoServers: '配置文件中没有servers对象',
    configLoadFail: (msg) => `加载配置文件失败: ${msg}`,
    checkConfig: '请检查配置文件/config/config.mjs\n',
    envFileNotExist: (file) => `环境文件不存在: ${file}`,
    configFormatError: `${e('❌', '[错误]')} 配置文件格式错误，缺少 default.servers 对象`,
    configKeyNotFound: (key) =>
      `${e('❌', '[错误]')} 配置中找不到服务器 key: ${key}`,
    needKeyOrPwd: `${e('❌', '[错误]')} 请配置私钥或密码环境变量`,
    foundServer: (name) => `找到服务器配置: ${name}`,
    buildFinished: `${e('✅', '[完成]')} Build finished`,
    userCancel: `\n${e('🚪', '[退出]')} 用户取消了部署（Ctrl+C）`,
    uncaughtException: `\n🚪 用户取消了部署（Ctrl+C）`,
    filesExist: (files) => `\n${e('⚠️', '[提示]')} 以下文件已存在：${files}`,
    file: {
      confirmOverwrite: '是否要覆盖现有文件？',
      overwriting: '正在覆盖文件...'
    },
    init: {
      starting: '正在初始化配置...',
      success: `初始化完成 ${e('✅', '[成功]')}`,
      failure: '初始化失败',
      errorMessage: (msg) => `初始化错误: ${msg}`
    },
    deploy: {
      selectTarget: '请选择要部署的服务器',
      cancelOption: `${e('❌', '[取消]')} 退出部署`,
      cancelDeploy: '已取消部署',
      notFound: `${e('❌', '[错误]')} 未找到指定的服务器配置,请检查配置文件是否正确`,
      hintListCommand: 'use: wukong-deploy list \n 查看所有服务器配置',
      executingOnServer: (name, host) =>
        `${e('📋', '[命令]')} 即将在 ${name} (${host}) 执行以下命令：`,
      commandConfirm: '确认要执行这些命令吗？',
      importConfigFail: (msg) =>
        `${e('❌', '[错误]')} 导入配置文件失败: ${msg}`,
      deployComplete: (msg) => `${e('🚀', '[部署]')} 部署 ${msg} 完成`
    },
    sshConnectSuccess: `${e('✅', '[连接成功]')} SSH 连接成功`,
    sshConnectFail: (msg) => `${e('❌', '[连接失败]')} SSH 连接失败：${msg}`,
    execCommand: (cmd, desc) => `${e('💻', '[执行]')} 执行命令：${cmd} ${desc}`,
    prompt: {
      cancelInit: `${e('🚪', '[退出]')} 用户取消了初始化（Ctrl+C）`
    },
    command: {
      exitCodeNotZero: `${e('🔴', '[错误]')} 命令 "\${cmd}" 退出码非 0：\${code}`,
      stderrTreatedAsError: `${e('🔴', '[错误]')} 命令 "\${cmd}" 输出错误信息（stderr）被视为失败`,
      matchedErrorPattern: `${e('🔴', '[错误]')} 命令 "\${cmd}" 匹配到错误模式：\${pattern}`,
      commandFailed: `${e('❌', '[失败]')} 命令失败：\${desc}`
    },
    backup: {
      confirmClearBackup: '确认清空所有备份文件吗？此操作不可撤销。',
      backupSuccess: (files, dir) => `已备份以下文件：\n${files} 到 \n${dir}`,
      noFilesToBackup: `${e('⚠️', '[提示]')} 没有可备份的文件。`,
      noBackupDir: `${e('⚠️', '[提示]')} 备份目录不存在，无需清理。`,
      clearCanceled: `${e('🚪', '[取消]')} 清理备份操作已取消。`,
      clearSuccess: `${e('✅', '[完成]')} 备份目录已清空。`,
      clearFailed: (msg) => `${e('❌', '[错误]')} 清理备份目录失败：${msg}`
    },
    emojiWarning: `⚠️ ✅ 🚀 ❌ 🎉🖥当前终端未启用 Emoji，已自动禁用（如需强制启用请设置环境变量 WUKONG_NO_EMOJI=0）`
  },
  en: {
    cancelDeploy: `${e('🚪', '[Exit]')} Deploy cancelled.`,
    cancelInit: `${e('🚪', '[Exit]')} Init cancelled.`,
    notInitialized: `${e('❌', '[Error]')} Project not initialized, please run: wukong-deploy init`,
    noServers: `${e('⚠️', '[Warning]')} No server config found, please run wukong-deploy init first`,
    serverList: `\n${e('📋', '[List]')} Server List:`,
    serverFound: (name, host) =>
      `\n${e('🖥️', '[Server]')} ${name} ${host}\n   Deploy commands:`,
    commandDesc: (idx, desc, cmd) => `   ${idx}. ${desc}: ${cmd}`,
    getServerListFail: (msg) =>
      `${e('❌', '[Failed]')} Failed to get server list: ${msg}`,
    initError: (msg) => `Init error: ${msg}`,
    deployError: (msg) => `${e('❌', '[Failed]')} Deploy error: ${msg}`,
    configFileNotExist: (file) => `Config file not found: ${file}`,
    configNoServers: 'No servers object in config file',
    configLoadFail: (msg) => `Failed to load config: ${msg}`,
    checkConfig: 'Please check /config/config.mjs\n',
    envFileNotExist: (file) => `Env file not found: ${file}`,
    configFormatError: `${e('❌', '[Error]')} Config file format error, missing default.servers`,
    configKeyNotFound: (key) =>
      `${e('❌', '[Error]')} Server key not found in config: ${key}`,
    needKeyOrPwd: `${e('❌', '[Error]')} Please configure private key or password env`,
    foundServer: (name) => `Found server config: ${name}`,
    buildFinished: `${e('✅', '[Done]')} Build finished`,
    userCancel: `\n${e('🚪', '[Exit]')} User cancelled deploy (Ctrl+C)`,
    uncaughtException: `\n🚪 User cancelled deploy (Ctrl+C)`,
    filesExist: (files) =>
      `\n${e('⚠️', '[Notice]')} The following files already exist: ${files}`,
    file: {
      confirmOverwrite: 'Do you want to overwrite the existing file?',
      overwriting: 'Overwriting files...'
    },
    init: {
      starting: 'Initializing configuration...',
      success: `Initialization complete ${e('✅', '[Success]')}`,
      failure: 'Initialization failed',
      errorMessage: (msg) => `Initialization error: ${msg}`
    },
    deploy: {
      selectTarget: 'Please select the server to deploy',
      cancelOption: `${e('❌', '[Cancel]')} Cancel deployment`,
      cancelDeploy: 'Deployment cancelled',
      notFound: `${e('❌', '[Error]')} Server config not found. Please check your config file.`,
      hintListCommand: 'use: wukong-deploy list \n to see all server configs',
      executingOnServer: (name, host) =>
        `\n${e('📋', '[Exec]')} Will execute the following commands on ${name} (${host}):`,
      commandConfirm: 'Confirm to execute these commands?',
      importConfigFail: (msg) =>
        `${e('❌', '[Error]')} Failed to import config file: ${msg}`,
      deployComplete: (msg) =>
        `${e('🚀', '[Deploy]')} Deployment to ${msg} completed`
    },
    sshConnectSuccess: `${e('✅', '[Connected]')} SSH connection successful`,
    sshConnectFail: (msg) =>
      `${e('❌', '[Failed]')} SSH connection failed: ${msg}`,
    execCommand: (cmd, desc) =>
      `${e('💻', '[Run]')} Executing command: ${cmd} ${desc}`,
    prompt: {
      cancelInit: `${e('🚪', '[Exit]')} User cancelled initialization (Ctrl+C)`
    },
    command: {
      exitCodeNotZero: `${e('🔴', '[Error]')} Command "\${cmd}" exited with non-zero code: \${code}`,
      stderrTreatedAsError: `${e('🔴', '[Error]')} Command "\${cmd}" stderr output is treated as failure`,
      matchedErrorPattern: `${e('🔴', '[Error]')} Command "\${cmd}" matched error pattern: \${pattern}`,
      commandFailed: `${e('❌', '[Failed]')} Command failed: \${desc}`
    },
    backup: {
      confirmClearBackup:
        'Are you sure you want to clear all backup files? This action cannot be undone.',
      backupSuccess: (files, dir) => `Backed up files: \n${files} to \n${dir}`,
      noFilesToBackup: `${e('⚠️', '[Notice]')} No files to backup.`,
      noBackupDir: `${e('⚠️', '[Notice]')} Backup directory does not exist, nothing to clear.`,
      clearCanceled: `${e('🚪', '[Cancel]')} Backup clear operation cancelled.`,
      clearSuccess: `${e('✅', '[Done]')} Backup directory cleared.`,
      clearFailed: (msg) =>
        `${e('❌', '[Error]')} Failed to clear backup directory: ${msg}`
    },
    emojiWarning: `⚠️ ✅ 🚀 ❌ 🎉🖥 Emoji is disabled because the current terminal does not support it. To force enable, set: WUKONG_NO_EMOJI=0`
  }
}

export default messages
