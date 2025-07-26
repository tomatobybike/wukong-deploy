# wukong-deploy

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
      commands: ['cd /your/project', 'git pull', 'npm run build'],
      finishMsg: '🎉 生产服务器部署完成'
    },
    prod: {
      name: '生产服务器',
      host: 'your.prod.ip',
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        'cd /home/ubuntu/app',
        'git pull origin main',
        'pm2 restart app'
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

## npm publish 前检查包

```bash

npm pack

```
