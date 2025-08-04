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
          ${
            isZh
              ? `// 这条服务器命令的执行目录`
              : `// The directory where this command is executed`
          }
          cwd: '/your/project',
          description: '${isZh ? '拉取最新代码' : 'Pull latest code'}',
          ${
            isZh
              ? `// 如果命令输出了 stderr（标准错误），就视为执行失败`
              : `// If the command outputs stderr (standard error), it is considered failed`
          }
          exitOnStdErr: false,
          ${
            isZh
              ? `// 如果 stderr 匹配这个正则，也视为执行失败`
              : `// The directory where this command is executed`
          }
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '${isZh ? '构建项目' : 'Build project'}',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
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
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/home/ubuntu/app',
          description: '${isZh ? '拉取最新代码' : 'Pull latest code'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm install --production',
          cwd: '/home/ubuntu/app',
          description: '${isZh ? '安装生产依赖' : 'Install production dependencies'}',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'pm2 restart app',
          cwd: '/home/ubuntu/app',
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

const configTemplates = {
  zh: {
    password: '你的密码',
    lang: 'zh',
    comments: {
      header: '# 🌏 这是环境配置',
      server53: '# 53号服务器密码',
      server54: '# 54号服务器密码',
      lang: '# 终端语言设置'
    }
  },
  en: {
    password: 'PASSWORD',
    lang: 'en',
    comments: {
      header: '# 🌍 This is English environment configuration',
      server53: '# Password for server 53',
      server54: '# Password for server 54',
      lang: '# Language setting for CLI/API 中文请设置WUKONG_LANG=zh'
    }
  }
}

export const generateConfigPasswordContent = (lang = 'zh') => {
  const template = configTemplates[lang] || configTemplates.en
  const { password, lang: langCode, comments } = template

  return [
    comments.header,
    `${comments.server53}\nSERVER_53_PASSWORD="${password}"`,
    `${comments.server54}\nSERVER_54_PASSWORD="${password}"`,
    `${comments.lang}\n#WUKONG_LANG=${langCode}`
  ].join('\n\n')
}
