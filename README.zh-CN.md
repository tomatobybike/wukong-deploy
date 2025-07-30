<p align="center">
    <img src="https://raw.githubusercontent.com/tomatobybike/wukong-deploy/main/images/logo.svg" width="200" alt="wukong-dev Logo" />
</p>
<br/>
<p align="center">
  <a href="https://www.npmjs.com/package/wukong-deploy"><img src="https://img.shields.io/npm/v/wukong-deploy.svg" alt="npm package"></a>
  <a href="https://www.npmjs.com/package/wukong-deploy"><img src="https://img.shields.io/npm/dm/wukong-deploy.svg" alt="npm downloadsy"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tomatobybike/wukong-deploy.svg" alt="GitHub license"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy"><img src="https://img.shields.io/github/stars/tomatobybike/wukong-deploy.svg?style=social" alt="GitHub stars"></a>
  <a href="ttps://github.com/tomatobybike/wukong-deploy/issues"><img src="https://img.shields.io/github/issues/tomatobybike/wukong-deploy.svg" alt="GitHub issues"></a>
</p>
<br/>

# wukong-deploy

[![npm version](https://img.shields.io/npm/v/wukong-deploy.svg)](https://www.npmjs.com/package/wukong-deploy)
[![npm downloads](https://img.shields.io/npm/dm/wukong-deploy.svg)](https://www.npmjs.com/package/wukong-deploy)
[![GitHub license](https://img.shields.io/github/license/tomatobybike/wukong-deploy.svg)](https://github.com/tomatobybike/wukong-deploy/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/tomatobybike/wukong-deploy.svg?style=social)](https://github.com/tomatobybike/wukong-deploy)
[![GitHub issues](https://img.shields.io/github/issues/tomatobybike/wukong-deploy.svg)](https://github.com/tomatobybike/wukong-deploy/issues)

一个轻量的基于 Node.js 的远程多服务器部署 CLI 工具。

## 安装

```bash

npm install -g wukong-deploy

```

## 使用

### 初始化配置

```bash

wukong-deploy init

```

会在当前目录生成示例 `.env` 和 `config/config.mjs` 配置文件。

### 部署

```bash
wukong-deploy deploy
```

根据提示选择对应的服务器

或者

```bash

wukong-deploy deploy [serverKey]

```

- `[serverKey]` 为配置文件中定义的服务器名称，例如 `test`、`prod`。

示例：

```bash

wukong-deploy deploy test

```

## 配置示例

`config/config.mjs`:

```js
export default {
  showCommandLog: true,
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
    prod: {
      name: '生产服务器',
      host: 'your.prod.ip',
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        {
          cmd: 'git pull origin main',
          cwd: '/your/project',
          description: '拉取最新代码',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        },
        {
          cmd: 'pm2 restart app',
          cwd: '/your/project',
          description: '重启服务',
          exitOnStdErr: false,
          // 如果 stderr 匹配这个正则，也视为执行失败
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '✅ 构建完成'
    }
  }
}
```

## 环境变量示例 `.env`

```env

SERVER_53_PASSWORD=your_password_here

```

[changelog](./CHANGELOG.md)

## npm publish 前检查包

```bash

npm pack

```
