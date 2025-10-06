---
sidebar_position: 1
---

# 介绍

wukong-deploy 是一个轻量级的部署工具，它可以帮助您轻松地将应用程序部署到远程服务器。通过简单的配置文件，您可以定义一系列要在远程服务器上执行的命令，并一键完成部署。

## 特性

- 🚀 **简单易用** - 通过简单的配置文件即可定义部署流程
- 🔄 **命令队列** - 按顺序执行一系列命令
- 🌐 **多服务器支持** - 同时部署到多台服务器
- 🔒 **安全可靠** - 支持 SSH 密钥认证
- 📝 **详细日志** - 提供清晰的部署过程日志
- 🌈 **多环境支持** - 轻松切换不同的部署环境

## 为什么选择 wukong-deploy？

在开发和运维过程中，我们经常需要将代码部署到远程服务器。传统的部署方式可能需要手动执行多个命令，或者编写复杂的脚本。wukong-deploy 通过提供简单的配置方式，让您可以轻松地定义和执行部署流程，大大提高了部署效率。

## 快速上手

通过 npm 安装：

```bash
npm install -g wukong-deploy
```

创建配置文件 `wukong.config.js`：

```javascript
export default {
  servers: [{
    host: 'your-server.com',
    username: 'root',
    commands: [
      'cd /path/to/your/project',
      'git pull',
      'npm install',
      'npm run build',
      'pm2 restart app'
    ]
  }]
}
```

执行部署：

```bash
wukong deploy
```

## 下一步


