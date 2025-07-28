<div align="center">
  <img src="https://raw.githubusercontent.com/tomatobybike/wukong-deploy/main/images/logo.svg" width="200" alt="wukong-dev Logo">
</div>

# wukong-deploy

[![npm version](https://img.shields.io/npm/v/wukong-deploy.svg)](https://www.npmjs.com/package/wukong-deploy)
[![npm downloads](https://img.shields.io/npm/dm/wukong-deploy.svg)](https://www.npmjs.com/package/wukong-deploy)
[![GitHub license](https://img.shields.io/github/license/tomatobybike/wukong-deploy.svg)](https://github.com/tomatobybike/wukong-deploy/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/tomatobybike/wukong-deploy.svg?style=social)](https://github.com/tomatobybike/wukong-deploy)
[![GitHub issues](https://img.shields.io/github/issues/tomatobybike/wukong-deploy.svg)](https://github.com/tomatobybike/wukong-deploy/issues)

English | [简体中文](./README.zh-CN.md)

A lightweight CLI tool for remote server deployment based on Node.js.

## Installation

```bash
npm install -g wukong-deploy
```

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

## License

MIT
