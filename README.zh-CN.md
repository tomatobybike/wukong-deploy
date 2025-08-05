## 📦 `wukong-deploy`

<p align="center">
  <img src="https://raw.githubusercontent.com/tomatobybike/wukong-deploy/main/images/logo.svg" width="200" alt="wukong-dev Logo" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/wukong-deploy"><img src="https://img.shields.io/npm/v/wukong-deploy.svg" alt="npm 版本"></a>
  <a href="https://www.npmjs.com/package/wukong-deploy"><img src="https://img.shields.io/npm/dm/wukong-deploy.svg" alt="下载量"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tomatobybike/wukong-deploy.svg" alt="许可证"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy"><img src="https://img.shields.io/github/stars/tomatobybike/wukong-deploy.svg?style=social" alt="GitHub 星标数"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy/issues"><img src="https://img.shields.io/github/issues/tomatobybike/wukong-deploy.svg" alt="问题数量"></a>
</p>

> ⚡️ 基于 Node.js 的轻量级部署 CLI，支持一键执行远程服务器命令队列。

中文 | [English](./README.md)

---

## 📚 目录

- [📦 `wukong-deploy`](#-wukong-deploy)
- [📚 目录](#-目录)
- [✨ 特性](#-特性)
- [🧱 安装要求](#-安装要求)
- [📦 安装](#-安装)
- [🚀 使用方法](#-使用方法)
  - [命令行命令](#命令行命令)
- [⚙️ 配置](#️-配置)
  - [`config/config.mjs`](#configconfigmjs)
- [➕ 添加多台服务器](#-添加多台服务器)
- [🌱 环境变量](#-环境变量)
  - [示例 `.env`](#示例-env)
- [📷 演示](#-演示)
- [🖥 支持系统](#-支持系统)
- [📦 升级](#-升级)
- [🌏 多语言支持](#-多语言支持)
- [📜 更新日志](#-更新日志)
- [🐛 常见问题](#-常见问题)
- [📄 许可证](#-许可证)
- [🔍 关键词](#-关键词)

---

## ✨ 特性

- 🚀 一条命令即可远程部署服务器
- 🔐 支持安全 SSH 和 SCP
- 📁 自定义文件或文件夹
- 📦 通过 `config.mjs` 和 `.env` 轻松配置
- 🌍 多语言支持：英文 / 简体中文
- 🧪 强化 stderr 错误匹配

---

## 🧱 安装要求

- Node.js >= 18.0.0
- Linux / macOS（推荐）
- Windows

---

## 📦 安装

```bash
npm install -g wukong-deploy
# 或者
yarn global add wukong-deploy
```

---

## 🚀 使用方法

### 命令行命令

```bash
wukong-deploy init       # 生成 .env 和 config/config.mjs
wukong-deploy deploy     # 交互式部署
wukong-deploy deploy dev # 部署指定服务器配置
```

可临时设置环境变量：

```bash
WUKONG_LANG=en WUKONG_DEBUG=1 wukong-deploy deploy
```

---

## ⚙️ 配置

### `config/config.mjs`

```js
export default {
  showCommandLog: true,
  servers: {
    dev: {
      name: '开发服务器',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_DEV_PASSWORD',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: '更新代码',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: '构建项目',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '🎉 部署完成'
    }
  }
}
```

---

## ➕ 添加多台服务器

要支持更多环境，只需在 `servers` 字段中添加新的配置项：

```js
export default {
  servers: {
    dev: {
      /* ... */
    },
    staging: {
      name: '预发布服务器',
      host: '123.45.67.89',
      username: 'deploy',
      passwordEnv: 'SERVER_STAGING_PASSWORD',
      commands: [
        {
          cmd: 'npm run build',
          cwd: '/srv/app',
          description: '构建应用',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '🚀 预发布部署完成'
    },
    prod: {
      /* ... */
    }
  }
}
```

然后，在 `.env` 文件里定义每个服务器的密码或其他秘密：

```env
SERVER_DEV_PASSWORD=your_dev_password
SERVER_STAGING_PASSWORD=your_staging_password
SERVER_PROD_PASSWORD=your_prod_password
```

部署到指定服务器：

```bash
wukong-deploy deploy staging
```

---

## 🌱 环境变量

你可以在 `.env` 中定义，也可以在 `.bashrc` / `.zshrc` 中导出：

| 变量名            | 说明                     | 示例 |
| ----------------- | ------------------------ | ---- |
| `WUKONG_DEV_MODE` | 启用详细/开发模式        | `1`  |
| `WUKONG_LANG`     | CLI 语言（`zh` 或 `en`） | `zh` |
| `WUKONG_NO_EMOJI` | 禁用 emoji 输出          | `1`  |
| `WUKONG_DEBUG`    | 启用内部调试日志         | `1`  |

💡 `WUKONG_NO_EMOJI`：某些 Windows 终端（如旧版 CMD）对 emoji 支持不好，建议设为 `1` 禁用。

### 示例 `.env`

```env
WUKONG_DEV_MODE=1
WUKONG_LANG=zh
WUKONG_NO_EMOJI=1
WUKONG_DEBUG=1

# 服务器登录密码
SERVER_DEV_PASSWORD=your_password
SERVER_STAGING_PASSWORD=your_password
```

---

## 📷 演示

```bash
wukong-deploy deploy
```

![演示](./images/demo.svg)

---

## 🖥 支持系统

- macOS
- Linux
- Windows（需安装 Git Bash）

---

## 📦 升级

```bash
npm update -g wukong-deploy
# 或者
yarn global upgrade wukong-deploy
```

---

## 🌏 多语言支持

根据你的终端系统语言自动切换中英文，无需额外配置。

| 语言环境变量       | 语言 |
| ------------------ | ---- |
| `LANG=zh_CN.UTF-8` | 中文 |
| `LANG=en_US.UTF-8` | 英文 |

你也可以通过命令参数强制指定语言：

```bash
wukong-deploy --lang=zh   # 强制中文
wukong-deploy --lang=en   # Force English
```

或者在 `.env` 中配置：

```bash
wukong-deploy --lang=zh   # 强制中文
wukong-deploy --lang=en   # Force English
```

---

## 📜 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)

---

## 🐛 常见问题

- **Windows 终端乱码**：建议使用支持 UTF-8 的终端，如 Windows Terminal
- **无 emoji 显示**：设置 `WUKONG_NO_EMOJI=1`
- **服务器登录失败**：
  - 请确认.env中的密码和config/config.mjs的username是否正确

---

## 📄 许可证

[MIT](./LICENSE)

---

## 🔍 关键词

<!-- 部署工具，自动部署，前端发布，Node.js 上线工具，wukong-deploy，发布到服务器, 多服务器管理 -->
