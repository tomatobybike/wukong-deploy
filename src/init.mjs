import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.DEV_MODE === '1'
const rootDir = isDev ? path.resolve(__dirname, '..') : process.cwd()

// 调试信息，帮助排查Windows问题
console.log(`当前工作目录: ${rootDir}`)
console.log(`当前模块目录: ${__dirname}`)

export default async function init() {
  // 使用path.join确保跨平台兼容性
  const configPath = path.resolve(rootDir, path.join('config', 'config.mjs'))
  const envPath = path.resolve(rootDir, '.env')

  // 打印路径信息
  console.log(`配置文件路径: ${configPath}`)
  console.log(`环境文件路径: ${envPath}`)

  // 确保目录存在，并打印调试信息
  const configDir = path.dirname(configPath)
  console.log(`创建配置目录: ${configDir}`)
  await fs.ensureDir(configDir)

  console.log(`写入配置文件: ${configPath}`)
  await fs.writeFile(
    configPath,
    `export default {
  showCommandLog: true,
  servers: {
    test: {
      name: '测试服务器',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_53_PASSWORD',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: '拉取最新代码'
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '构建项目'
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
          description: '拉取最新代码'
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '构建项目'
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
          description: '拉取最新代码'
        },
        {
          cmd: 'npm install --production',
          cwd: '/home/ubuntu/app',
          description: '安装生产依赖'
        },
        {
          cmd: 'pm2 restart app',
          cwd: '/home/ubuntu/app',
          description: '重启应用'
        }
      ],
      finishMsg: '✅ 构建完成'
    }
  }
}
`
  )

  console.log(`写入环境文件: ${envPath}`)
  await fs.writeFile(
    envPath,
    'SERVER_53_PASSWORD="你的密码"\nSERVER_54_PASSWORD="你的密码"\n'
  )

  // 验证文件是否成功创建
  const configExists = await fs.pathExists(configPath)
  const envExists = await fs.pathExists(envPath)

  console.log(`配置文件创建状态: ${configExists ? '成功' : '失败'}`)
  console.log(`环境文件创建状态: ${envExists ? '成功' : '失败'}`)

  console.log(`✅ 已生成 ${configPath} 和 ${envPath} 文件`)
}
