// locales/index.js
export const locales = {
  zh: {
    description: '一个用于远程服务器部署的工具。',
    github: 'https://github.com/tomatobybike/wukong-deploy',
    commands: [
      { name: 'init', desc: '初始化配置' },
      { name: 'list', desc: '显示所有可部署的服务器及其部署命令' },
      { name: 'deploy', desc: '根据提示选择服务器进行部署' },
      { name: 'deploy [server]', desc: '部署指定服务器' },
      { name: 'info', desc: '显示作者和项目信息' }
    ],
    options: [
      { flags: '-v, --version', desc: '显示版本号' },
      { flags: '-h, --help', desc: '显示帮助信息' },
      { flags: '-e, --example', desc: '显示示例' },
      { flags: '--lang=en', desc: '使用中文' },
      { flags: '-f, --force', desc: '在 init 时强制覆盖已有配置文件' }
    ],
    examples: [
      'wukong-deploy init',
      'wukong-deploy init --force',
      'wukong-deploy list',
      'wukong-deploy deploy',
      'wukong-deploy deploy prod',
      'wukong-deploy -v'
    ]
  },
  en: {
    description: 'A tool for deploying applications to remote servers.',
    github: 'https://github.com/tomatobybike/wukong-deploy',
    commands: [
      { name: 'init', desc: 'Initialize configuration' },
      { name: 'list', desc: 'List all deployable servers' },
      { name: 'deploy', desc: 'Deploy by choosing server' },
      { name: 'deploy [server]', desc: 'Deploy specified server' },
      { name: 'info', desc: 'Show author and project information' }
    ],
    options: [
      { flags: '-v, --version', desc: 'Show version number' },
      { flags: '-h, --help', desc: 'Show help information' },
      { flags: '-e, --example', desc: 'Show examples' },
      { flags: '--lang=zh', desc: 'use chinese' },
      {
        flags: '-f, --force',
        desc: 'Force overwrite existing config on init'
      }
    ],
    examples: [
      'wukong-deploy init',
      'wukong-deploy init --force',
      'wukong-deploy list',
      'wukong-deploy deploy',
      'wukong-deploy deploy prod',
      'wukong-deploy -v'
    ]
  }
}
