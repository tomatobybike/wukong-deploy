import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.DEV_MODE === '1'
const rootDir = isDev ? path.resolve(__dirname, '..') : process.cwd()

export default async function init() {
  const configPath = path.resolve(rootDir, 'config/config.mjs')
  const envPath = path.resolve(rootDir, '.env')

  await fs.ensureDir(path.dirname(configPath))

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
      commands: ['cd /your/project', 'git pull', 'npm run build'],
      finishMsg: '🎉 测试服务器部署完成'
    },
    dev: {
      name: '测试服务器',
      host: '192.168.0.124',
      username: 'root',
      passwordEnv: 'SERVER_54_PASSWORD',
      commands: ['cd /your/project', 'git pull', 'npm run build'],
      finishMsg: '✅ 构建完成'
    },
    prod: {
      name: '生产服务器',
      host: 'your.prod.ip',
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        'cd /home/ubuntu/app',
        'git pull origin main',
        'pm2 restart app'
      ],
      finishMsg: '✅ 构建完成'
    }
  }
}
`
  )

  await fs.writeFile(
    envPath,
    'SERVER_53_PASSWORD="你的密码"\nSERVER_54_PASSWORD="你的密码"\n'
  )

  console.log(`✅ 已生成 ${configPath} 和 ${envPath} 文件`)
}
