import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

import { devLog, isDev } from './utils/devLog.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = isDev ? path.resolve(__dirname, '..') : process.cwd()

// 调试信息，帮助排查Windows问题

devLog(`当前工作目录: ${rootDir}`)
devLog(`当前模块目录: ${__dirname}`)

export default async function init() {
  // 使用path.join确保跨平台兼容性
  const configPath = path.resolve(rootDir, path.join('config', 'config.mjs'))
  const envPath = path.resolve(rootDir, '.env')

  // 打印路径信息

  devLog(`配置文件路径: ${configPath}`)
  devLog(`环境文件路径: ${envPath}`)

  // 确保目录存在，并打印调试信息
  const configDir = path.dirname(configPath)
  devLog(`创建配置目录: ${configDir}`)

  await fs.ensureDir(configDir)
  devLog(`写入配置文件: ${configPath}`)

  await fs.writeFile(
    configPath,
    `export default {
  showCommandLog: false,
  servers: {
    test: {
      name: '测试服务器',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_53_PASSWORD',
      commands: [
        {
          // 某些命令可能返回 code=0，但 stderr 中包含关键错误
          cmd: 'git pull',
          cwd: '/your/project',
          description: '拉取最新代码',
          // 如果命令输出了 stderr（标准错误），就视为执行失败
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '构建项目',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '🎉 测试服务器部署完成'
    },
    dev: {
      name: '研发服务器',
      host: '192.168.0.124',
      username: 'root',
      passwordEnv: 'SERVER_54_PASSWORD',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: '拉取最新代码',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '构建项目',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '✅ 构建完成'
    },
    prod: {
      name: '生产服务器',
      host: 'your.prod.ip',
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/home/ubuntu/app',
          description: '拉取最新代码',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm install --production',
          cwd: '/home/ubuntu/app',
          description: '安装生产依赖',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        },
        {
          cmd: 'pm2 restart app',
          cwd: '/home/ubuntu/app',
          description: '重启应用',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '✅ 构建完成'
    }
  }
}
`
  )

  devLog(`写入环境文件: ${envPath}`)

  await fs.writeFile(
    envPath,
    'SERVER_53_PASSWORD="你的密码"\nSERVER_54_PASSWORD="你的密码"\n'
  )

  // 验证文件是否成功创建
  const configExists = await fs.pathExists(configPath)
  const envExists = await fs.pathExists(envPath)

  devLog(`配置文件创建状态: ${configExists ? '成功' : '失败'}`)
  devLog(`环境文件创建状态: ${envExists ? '成功' : '失败'}`)

  devLog(`✅ 已生成 ${configPath} 和 ${envPath} 文件`)
}
