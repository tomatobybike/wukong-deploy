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

[![npm version](https://img.shields.io/npm/v/wukong-deploy.svg)](https://www.npmjs.com/package/wukong-deploy)
[![npm downloads](https://img.shields.io/npm/dm/wukong-deploy.svg)](https://www.npmjs.com/package/wukong-deploy)
[![GitHub license](https://img.shields.io/github/license/tomatobybike/wukong-deploy.svg)](https://github.com/tomatobybike/wukong-deploy/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/tomatobybike/wukong-deploy.svg?style=social)](https://github.com/tomatobybike/wukong-deploy)
[![GitHub issues](https://img.shields.io/github/issues/tomatobybike/wukong-deploy.svg)](https://github.com/tomatobybike/wukong-deploy/issues)

一个轻量的基于 Node.js 的远程多服务器部署 CLI 工具。

## 📷 使用效果预览

![使用示例](./images/demo.svg)

### 🌟 功能亮点：

- 一条命令部署到服务器，支持 SSH/SCP
- 自动生成配置文件，支持多环境部署
- 日志输出清晰，部署过程一目了然
- 配置简单，适合个人和团队使用
-

## 🧩 安装使用：

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
      finishMsg: '🎉 测试服务器部署完成'
    },
    prod: {
      name: '生产服务器',
      host: 'your.prod.ip',
      username: 'ubuntu',
      privateKey: '~/.ssh/id_rsa',
      commands: [
        {
          cmd: 'git pull origin main',
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

## 环境变量示例 `.env`

```env

# 🌏 这是环境配置

# 53号服务器密码
SERVER_53_PASSWORD="你的密码"

# 54号服务器密码
SERVER_54_PASSWORD="你的密码"

# 终端语言设置
WUKONG_LANG=zh

```

[CHANGE](./CHANGELOG.md)

## npm publish 前检查包

```bash

npm pack

```

---

## ⚙️ 环境变量配置

你可以通过设置以下环境变量，来定制 `wukong-deploy` 的行为：

| 环境变量名        | 描述                                                 | 示例值       |
| ----------------- | ---------------------------------------------------- | ------------ |
| `DEV_MODE`        | 开启开发模式，输出额外的调试信息                     | `true` / `1` |
| `WUKONG_NO_EMOJI` | 禁用 emoji 表情符号，适用于不支持 emoji 的终端环境   | `true` / `1` |
| `WUKONG_LANG`     | 设置 CLI 输出语言（当前支持 `zh` 中文 和 `en` 英文） | `zh` / `en`  |
| `WUKONG_DEBUG`    | 启用调试日志，显示内部 CLI 行为用于排查问题          | `true` / `1` |

### 🧪 使用示例

临时设置：

```bash
WUKONG_NO_EMOJI=1 WUKONG_LANG=zh WUKONG_DEBUG=1 wukong-deploy deploy
```

永久设置（推荐写入 .env 或 .bashrc 文件）：

```bash
export WUKONG_LANG=zh
export WUKONG_NO_EMOJI=1
export DEV_MODE=1
```

### 📝 `.env.example` 文件内容：

```env
# Enable development logs
DEV_MODE=1

# 禁止表情符号
WUKONG_NO_EMOJI=1

# CLI 语言 (zh or en)
WUKONG_LANG=zh

# 开启调试模式
WUKONG_DEBUG=1
```

🎯 使用场景推荐

| 使用场景          | 建议配置                              |
| ----------------- | ------------------------------------- |
| 终端不支持 emoji  | `WUKONG_NO_EMOJI=1`                   |
| 部署排查问题      | `WUKONG_DEBUG=1` 或 `DEV_MODE=1`      |
| 脚本 / 自动化环境 | `WUKONG_LANG=zh`，`WUKONG_NO_EMOJI=1` |
| 本地 CLI 开发     | `DEV_MODE=1`, `WUKONG_DEBUG=1`        |

<!-- 部署工具、自动部署、前端部署、Node.js上线、wukong、wukong-deploy、发布工具、远程部署、SSH部署、项目发布、构建上线、DevOps 工具、发布脚本 -->
