---
sidebar_position: 1
---

# 快速开始

## 什么是 wukong-deploy？

wukong-deploy 是一个基于 Node.js 的轻量级部署工具，它可以帮助你快速地将代码部署到远程服务器。通过简单的配置，你可以一键执行一系列远程命令，轻松实现自动化部署流程。

## 特性

- 🚀 一键部署到远程服务器
- 🔐 支持安全的 SSH 和 SCP 传输
- 📁 灵活的文件和文件夹管理
- 📦 简单的配置文件管理
- 🌍 支持多语言（中文/英文）
- 🧪 强大的错误处理机制

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
