# wukong-deploy

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
      finishMsg: '🎉 生产服务器部署完成'
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

## Environment Variable Example (`.env`)

```env
SERVER_53_PASSWORD=your_password_here
```

## License

MIT
