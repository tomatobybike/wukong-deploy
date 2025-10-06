## 📦 `wukong-deploy`

<p align="center">
  <img src="https://raw.githubusercontent.com/tomatobybike/wukong-deploy/main/images/logo.svg" width="200" alt="wukong-dev Logo" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/wukong-deploy"><img src="https://img.shields.io/npm/v/wukong-deploy.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/wukong-deploy"><img src="https://img.shields.io/npm/dm/wukong-deploy.svg" alt="downloads"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy/blob/master/LICENSE"><img src="https://img.shields.io/github/license/tomatobybike/wukong-deploy.svg" alt="license"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy"><img src="https://img.shields.io/github/stars/tomatobybike/wukong-deploy.svg?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/tomatobybike/wukong-deploy/issues"><img src="https://img.shields.io/github/issues/tomatobybike/wukong-deploy.svg" alt="issues"></a>
</p>

> ⚡️ A lightweight Node.js CLI for remote server deployment — run any command queue with a single line.

English | [简体中文](./README.zh-CN.md)

---

## 📚 Table of Contents

- [📦 `wukong-deploy`](#-wukong-deploy)
- [📚 Table of Contents](#-table-of-contents)
- [✨ Features](#-features)
- [🧱 Requirements](#-requirements)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
  - [CLI Commands](#cli-commands)
- [⚙️ Configuration](#️-configuration)
  - [`config/config.mjs`](#configconfigmjs)
- [➕ Adding Multiple Servers](#-adding-multiple-servers)
- [🌱 Environment Variables](#-environment-variables)
  - [Example `.env`](#example-env)
- [📷 Demo](#-demo)
- [🖥 Supported Platforms](#-supported-platforms)
- [📦 Upgrade](#-upgrade)
- [🌏 Multi-language Support](#-multi-language-support)
- [📜 Changelog](#-changelog)
- [🐛 Troubleshooting](#-troubleshooting)
- [📄 License](#-license)
- [🔍 Keywords](#-keywords)

---

## ✨ Features

- 🚀 One-command deployment to remote servers
- 🔐 Secure SSH + SCP support
- 📁 Custom file/folder inclusion
- 📦 Easily configurable with `config.mjs` and `.env`
- 🌍 Multilingual CLI: English / 简体中文
- 🧪 Robust stderr error matching

---

## 🧱 Requirements

- Node.js >= 18.0.0
- Linux / macOS (recommended)
- Windows

---

## 📦 Installation

```bash
npm install -g wukong-deploy
# or
yarn global add wukong-deploy
```

---

## 🚀 Usage

### CLI Commands

```bash
wukong-deploy init       # Generate .env and config/config.mjs
wukong-deploy deploy     # Interactive deployment
wukong-deploy deploy dev # Deploy using specific server key
```

Set environment variables on the fly:

```bash
WUKONG_LANG=en WUKONG_DEBUG=1 wukong-deploy deploy
```

---

## ⚙️ Configuration

### `config/config.mjs`

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
        }
      ],
      finishMsg: '🎉 Deployment completed'
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
          description: 'show yarn version',
          isLocal: true
        },
        {
          cmd: 'open http://www.google.com/',
          description: 'open url',
          isLocal: true
        }
      ],
      finishMsg: '🎉 Deployment completed'
    }
  }
}
```

---

## ➕ Adding Multiple Servers

To deploy to more environments, simply add more entries in the `servers` field:

```js
export default {
  servers: {
    dev: {
      /* ... */
    },
    staging: {
      name: 'Staging Server',
      host: '123.45.67.89',
      username: 'deploy',
      passwordEnv: 'SERVER_STAGING_PASSWORD',
      commands: [
        {
          cmd: 'npm run build',
          cwd: '/srv/app',
          description: 'Build app',
          exitOnStdErr: false,
          errorMatch: /Permission denied/
        }
      ],
      finishMsg: '🚀 Staging deployment done'
    },
    prod: {
      /* ... */
    }
  }
}
```

Then, define each server's password (or other secrets) in your `.env` file:

```env
SERVER_DEV_PASSWORD=your_dev_password
SERVER_STAGING_PASSWORD=your_staging_password
SERVER_PROD_PASSWORD=your_prod_password
```

To deploy to a specific server:

```bash
wukong-deploy deploy staging
```

---

## 🌱 Environment Variables

You can define these variables in `.env`, or export them in `.bashrc` / `.zshrc`:

| Variable          | Description                 | Example |
| ----------------- | --------------------------- | ------- |
| `WUKONG_DEV_MODE` | Enable verbose/dev mode     | `1`     |
| `WUKONG_LANG`     | CLI language (`zh` or `en`) | `zh`    |
| `WUKONG_NO_EMOJI` | Disable emoji output        | `1`     |
| `WUKONG_DEBUG`    | Enable internal debug logs  | `1`     |

💡 `WUKONG_NO_EMOJI`: 某些 Windows 终端（如旧版 CMD）对 emoji 显示不友好，建议设置为 `1` 禁用。

### Example `.env`

```env
WUKONG_DEV_MODE=1
WUKONG_LANG=zh
WUKONG_NO_EMOJI=1
WUKONG_DEBUG=1

# Server login credentials
SERVER_DEV_PASSWORD=your_password
SERVER_STAGING_PASSWORD=your_password
```

---

## 📷 Demo

```bash
wukong-deploy deploy
```

![Demo](./images/demo.svg)

---

## 🖥 Supported Platforms

- macOS
- Linux
- Windows (Windows Terminal or Git Bash recommended to avoid encoding and emoji problems in CMD)

---

## 📦 Upgrade

```bash
npm update -g wukong-deploy
# or
yarn global upgrade wukong-deploy
```

---

## 🌏 Multi-language Support

Automatically switches between Chinese and English based on your terminal's system language, no extra configuration needed.

| Language Environment Variable | Language |
| ----------------------------- | -------- |
| `LANG=zh_CN.UTF-8`            | Chinese  |
| `LANG=en_US.UTF-8`            | English  |

You can also force the language via command-line argument:

```bash
wukong-deploy --lang=zh   # 强制中文
wukong-deploy --lang=en   # Force English
```

Or configure it in your `.env` file similarly:

```bash
WUKONG_LANG=zh   # 强制中文
WUKONG_LANG=en   # Force English
```

---

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

---

## 🐛 Troubleshooting

- **Garbled characters in Windows terminal**: It is recommended to use a UTF-8 capable terminal, such as Windows Terminal.

- **Emoji not displaying**: Set `WUKONG_NO_EMOJI=1`

- **Server login failure**:

  - Please verify that the password in `.env` and the username in `config/config.mjs` are correct.

- **PowerShell Error: Cannot load file `wukong-deploy.ps1` (execution policy restriction)**:

  - **Cause**:
    By default, PowerShell blocks the execution of `.ps1` script files. When installing global packages via `npm install -g`, a `.ps1` launcher is created, which may be blocked on your system.

  - **Solution 1 (recommended)**:
    Set a more permissive execution policy for the current user:

    ```powershell
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

    ✅ Run PowerShell as Administrator when executing this command.

  - **Solution 2**:
    Use `yarn` for global installation (no `.ps1` script generated):

    ```bash
    npm uninstall -g wukong-deploy
    yarn global add wukong-deploy
    ```

  - **Solution 3**:
    Manually delete the `.ps1` launcher script. PowerShell will then use the `.cmd` file instead.

    Default global path:

    ```
    C:\Users\<YourUsername>\AppData\Roaming\npm\wukong-deploy.ps1
    ```

    ⚠️ This file may be regenerated if you reinstall the package via npm.

  - **Solution 4**:
    Run the CLI directly via Node.js (bypasses shell script entirely):

    ```bash
    node "$(npm root -g)/wukong-deploy/bin/cli.js"
    ```

---

## 📄 License

[MIT](./LICENSE)

---

## 🔍 Keywords

<!-- cli, deploy, deployment, ssh ,multi-server ,automation ,javascript, nodejs ,command-line ,script ,frontend ,remote server, server management ,server deployment -->
