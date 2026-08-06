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
    - [上传命令（SPA 前端部署）(version \>=1.2.42)](#上传命令spa-前端部署version-1242)
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
wukong-deploy init       # 生成 .env.wukong 和 config/config.mjs
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

version >=1.2.8

you can run local commands:

```js
export default {
  showCommandLog: true,
  servers: {
    dev: {
      name: 'Dev Server',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_DEV_PASSWORD',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: 'Update code',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: 'Build project',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        },
        {
          cmd: 'curl http://www.google.com/',
          description: 'curl url',
          isLocal: true
        },
        {
          cmd: 'yarn -v',
          description: '查看 yarn 版本',
          isLocal: true
        },
        {
          cmd: 'open http://www.google.com/',
          description: '打开网页',
          isLocal: true
        }
      ],
      finishMsg: '🎉 Deployment completed'
    }
  }
}
```

#### 上传命令（SPA 前端部署）(version >=1.2.42)

对于 SPA（单页应用）项目，可以使用 `upload` 命令类型，将本地构建产物压缩后上传到服务器并自动解压：

```js
{
  upload: {
    local: './dist',                // 本地要上传的目录
    remote: '/www/wwwroot/app/dist/', // 远程目标目录
    backup: true,                     // 覆盖前备份服务器现有目录
    format: 'tar'                     // 备份格式: 'tar' (默认, tar.gz) 或 'zip'
  },
  description: '压缩并上传 dist 目录'
}
```

上传流程：
1. **备份**（`backup: true` 时）：将服务器现有目录打包为 `dist_backup_<时间戳>.tar.gz`（或 `.zip`，取决于 `format` 配置）
2. **压缩**：将本地目录压缩为 `.zip`（跨平台兼容，使用 Node.js `archiver` 库）
3. **上传**：将 zip 文件上传到服务器 `/tmp` 目录
4. **解压**：通过 `unzip -o` 解压到目标路径（服务器缺少 unzip 时会自动安装）
5. **清理**：删除本地和远程的临时 zip 文件

完整的 SPA 项目部署配置示例：

```js
export default {
  servers: {
    dev: {
      name: '开发服务器',
      host: '123.45.67.89',
      username: 'root',
      passwordEnv: 'SERVER_DEV_PASSWORD',
      commands: [
        {
          cmd: 'rm -rf dist/',
          isLocal: true,
          description: '清理本地 dist 目录'
        },
        {
          cmd: 'pnpm run build:dev',
          isLocal: true,
          description: '构建项目'
        },
        {
          upload: {
            local: './dist',
            remote: '/www/wwwroot/ai/dist/',
            backup: true,
            format: 'tar'
          },
          description: '压缩并上传到服务器'
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

然后，在 `.env.wukong` 文件里定义每个服务器的密码或其他秘密：

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

你可以在 `.env.wukong` 中定义，也可以在 `.bashrc` / `.zshrc` 中导出：

| 变量名            | 说明                     | 示例 |
| ----------------- | ------------------------ | ---- |
| `WUKONG_DEV_MODE` | 启用详细/开发模式        | `1`  |
| `WUKONG_LANG`     | CLI 语言（`zh` 或 `en`） | `zh` |
| `WUKONG_NO_EMOJI` | 禁用 emoji 输出          | `1`  |
| `WUKONG_DEBUG`    | 启用内部调试日志         | `1`  |

💡 `WUKONG_NO_EMOJI`：某些 Windows 终端（如旧版 CMD）对 emoji 支持不好，建议设为 `1` 禁用。

### 示例 `.env.wukong`

```env
WUKONG_DEV_MODE=1
WUKONG_LANG=zh
WUKONG_NO_EMOJI=1
WUKONG_DEBUG=1

# 服务器登录密码
SERVER_DEV_PASSWORD=your_password
SERVER_STAGING_PASSWORD=your_password
```

> **兼容说明**：v1.2.42 之前使用 `.env`。当前版本仍会读取 `.env` 作为兼容，但 `wukong-deploy init` 生成的 `.env.wukong` 优先级更高。

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
- Windows（推荐使用 Windows Terminal 或 Git Bash，避免 CMD 编码和 emoji 显示问题）

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

或者在 `.env.wukong` 中配置：

```bash
WUKONG_LANG=zh   # 强制中文
WUKONG_LANG=en   # Force English
```

---

## 📜 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md)

---

## 🐛 常见问题

- **Windows 终端乱码**：建议使用支持 UTF-8 的终端，如 Windows Terminal
- **无 emoji 显示**：设置 `WUKONG_NO_EMOJI=1`
- **服务器登录失败**：
  - 请确认`.env.wukong`中的密码和`config/config.mjs`的username是否正确
- **❌ PowerShell 报错：无法加载文件 `wukong-deploy.ps1`（执行策略限制）**：

  - 原因：PowerShell 默认禁止执行 .ps1 脚本。通过 npm install -g 安装时会自动创建 .ps1 启动脚本，而 yarn global add 仅生成 .cmd 文件，因此不会触发该限制。
  - 解决方法一（仅影响当前用户）：

    ```powershell

    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

  - 解决方法二（绕过）：
    删除全局目录中的 `wukong-deploy.ps1` 文件，PowerShell 将自动改用 `.cmd` 执行。
    全局目录一般在：

    ```bash

    C:\Users\<用户名>\AppData\Roaming\npm\
    ```

  - 解决方法三：或使用 Node.js 直接运行 CLI：

    ```bash

    node "$(npm root -g)/wukong-deploy/bin/cli.js"
    ```

  - 解决方法四（推荐）：改用 yarn 全局安装（不会生成 .ps1 文件）：

    ```bash

    npm uninstall wukong-deploy -g
    yarn global add wukong-deploy
    ```

---

## 📄 许可证

[MIT](./LICENSE)

---

## 🔍 关键词

<!-- 部署工具，自动部署，前端发布，Node.js 上线工具，wukong-deploy，发布到服务器, 多服务器管理 -->
