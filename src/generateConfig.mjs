export const generateConfigContent = (lang = 'zh') => {
  const isZh = lang === 'zh'

  return `export default {
  showCommandLog: true,
  servers: {
    test: {
      name: '${isZh ? '测试服务器' : 'Test Server'}',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_53_PASSWORD',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: '${isZh ? '拉取最新代码' : 'Pull latest code'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '${isZh ? '构建项目' : 'Build project'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '${isZh ? '🎉 测试服务器部署完成' : '🎉 Test server deployment complete'}'
    },
    dev: {
      name: '${isZh ? '研发服务器' : 'Dev Server'}',
      host: '192.168.0.124',
      username: 'root',
      passwordEnv: 'SERVER_54_PASSWORD',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: '${isZh ? '拉取最新代码' : 'Pull latest code'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '${isZh ? '构建项目' : 'Build project'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '${isZh ? '✅ 构建完成' : '✅ Build complete'}'
    },
    prod: {
      name: '${isZh ? '生产服务器' : 'Production Server'}',
      host: 'your.prod.ip',
      username: '${isZh ? 'ubuntu' : 'ubuntu'}',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        {
          cmd: 'git pull',
          cwd: '${isZh ? '/home/ubuntu/app' : '/home/ubuntu/app'}',
          description: '${isZh ? '拉取最新代码' : 'Pull latest code'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm install --production',
          cwd: '${isZh ? '/home/ubuntu/app' : '/home/ubuntu/app'}',
          description: '${isZh ? '安装生产依赖' : 'Install production dependencies'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'pm2 restart app',
          cwd: '${isZh ? '/home/ubuntu/app' : '/home/ubuntu/app'}',
          description: '${isZh ? '重启应用' : 'Restart app'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '${isZh ? '✅ 构建完成' : '✅ Build complete'}'
    }
  }
}
`
}

export const generateConfigPasswordContent = (lang = 'zh') => {
  const isZh = lang === 'zh'

  return `${isZh ? 'SERVER_53_PASSWORD="你的密码"\nSERVER_54_PASSWORD="你的密码"' : 'SERVER_53_PASSWORD="PASSWORD"\nSERVER_54_PASSWORD="PASSWORD"'}`
}
