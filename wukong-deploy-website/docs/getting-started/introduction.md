---
sidebar_position: 1
---

# Introduction

## What is wukong-deploy?

wukong-deploy is a lightweight Node.js-based deployment tool that helps you quickly deploy code to remote servers. With simple configuration, you can execute a series of remote commands with one click, easily achieving automated deployment processes.

## Features

- 🚀 One-click deployment to remote servers
- 🔐 Secure SSH and SCP transfer support
- 📁 Flexible file and folder management
- 📦 Simple configuration file management
- 🌍 Multi-language support (Chinese/English)
- 🧪 Robust error handling mechanism

## 安装

使用 npm 安装：

```bash
npm install -g wukong-deploy
```

或者使用 yarn：

```bash
yarn global add wukong-deploy
```

## 基本使用

1. 初始化配置文件：

```bash
wukong-deploy init
```

2. 编辑配置文件：

```javascript
// config/config.mjs
export default {
  servers: {
    dev: {
      name: "开发服务器",
      host: "192.168.1.100",
      username: "root",
      passwordEnv: "SERVER_PASSWORD",
      commands: [
        {
          cmd: "git pull",
          cwd: "/path/to/project",
          description: "更新代码"
        },
        {
          cmd: "npm install",
          cwd: "/path/to/project",
          description: "安装依赖"
        }
      ]
    }
  }
}
```

3. 开始部署：

```bash
wukong-deploy deploy
```

## 下一步

- 查看 [配置指南](/docs/configuration) 了解更多配置选项
- 了解 [最佳实践](/docs/best-practices) 优化你的部署流程
- 阅读 [常见问题](/docs/faq) 解决使用中遇到的问题
