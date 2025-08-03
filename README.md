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

English | [简体中文](./README.zh-CN.md)

> ⚡️ A lightweight CLI tool for remote server deployment based on Node.js.

## Demo

![Demo](./images/demo.svg)



## 🧠 Features

- 🚀 One-command deployment to remote servers
- 🔐 Secure SSH + SCP support
- 📁 Custom file/folder inclusion
- 📦 Easily configurable with `config.mjs`

## 📦 Installation

```bash
npm install -g wukong-deploy
```

## 🚀 Quick Start

```bash
wukong-deploy init     # Generate config file
wukong-deploy deploy   # Deploy to remote server
```

## 📷 Example Screenshot

✅ Deployed ./dist to root@your.server.com:/var/www/html/project

## Usage

### Initialize Configuration

```bash
wukong-deploy init
```

This will generate a sample `.env` and `config/config.mjs` file in your current working directory.

### Deploy

```bash
wukong-deploy deploy
```

You will be prompted to select a target server interactively.

Or specify the server key directly:

```bash
wukong-deploy deploy [serverKey]
```

- `[serverKey]` is the key defined in your configuration file (e.g., `test`, `prod`).

Example:

```bash
wukong-deploy deploy test
```

## Configuration Example

`config/config.mjs`:

```js
export default {
  showCommandLog: true,
  servers: {
    test: {
      name: 'Test Server',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_53_PASSWORD',
      commands: [
        {
          // Some commands may return code=0, but the standard error contains a critical error
          cmd: 'git pull',
          cwd: '/your/project',
          description: 'Pull the latest code',
          // If the command outputs standard error (std err), it is considered to have failed execution
          exitOnStdErr: false,
          // If the standard error matches this rule, it is also considered a execution failure
          errorMatch: /Permission denied/
        },
        {
          cmd: 'npm run build',
          cwd: '/your/project',
          description: 'Build Project',
          exitOnStdErr: false,
          // If the standard error matches this rule, it is also considered a execution failure
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '🎉 Deployment completed'
    },
    prod: {
      name: 'Production Server',
      host: 'your.prod.ip',
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        {
          cmd: 'git pull',
          cwd: '/your/project',
          description: 'Pull the latest code',
          exitOnStdErr: false,
          //  If the standard error matches this rule, it is also considered a execution failure
          errorMatch: /Permission denied/
        },
        {
          cmd: 'pm2 restart app',
          cwd: '/your/project',
          description: 'restart server',
          exitOnStdErr: false,
          //  If the standard error matches this rule, it is also considered a execution failure
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '✅ Build completed'
    }
  }
}
```

## Environment Variable Example (`.env`)

```env
SERVER_53_PASSWORD=your_password_here
```

[changelog](./CHANGELOG.md)

---

## ⚙️ Environment Variables

You can customize the behavior of `wukong-deploy` by setting the following environment variables:

| Variable Name     | Description                                                | Example      |
| ----------------- | ---------------------------------------------------------- | ------------ |
| `DEV_MODE`        | Enables development mode with additional debug output      | `true` / `1` |
| `WUKONG_NO_EMOJI` | Disables emoji output (useful in unsupported terminals)    | `true` / `1` |
| `LANG`            | Sets the CLI language (`zh` for Chinese, `en` for English) | `zh` / `en`  |
| `WUKONG_DEBUG`    | Enables internal debug logs for troubleshooting            | `true` / `1` |

### 🧪 Example Usage

Set variables temporarily:

```bash
WUKONG_NO_EMOJI=1 LANG=en WUKONG_DEBUG=1 wukong-deploy deploy
```

Or permanently in .env, .bashrc, or .zshrc:

```bash
export LANG=zh
export WUKONG_NO_EMOJI=true
export DEV_MODE=true
```

---

### 📝 `.env.example` 文件内容：

```env
# Enable development logs
DEV_MODE=1

# Disable emoji output
WUKONG_NO_EMOJI=1

# CLI language (zh or en)
LANG=zh

# Enable debug mode
WUKONG_DEBUG=1
```

---

## License

MIT

<!-- 中文关键词：部署工具, 自动部署, 前端发布, Node.js上线工具, wukong-deploy, 发布到服务器 -->
