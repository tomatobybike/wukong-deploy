---
sidebar_position: 1
---

# 多服务器部署

wukong-deploy 支持同时部署到多台服务器，让您可以轻松地管理多环境部署。

## 基本配置

在 `wukong.config.js` 中配置多个服务器：

```javascript
export default {
  servers: {
    dev: {
      name: '开发服务器',
      host: '127.215.84.53',
      username: 'root',
      passwordEnv: 'SERVER_53_PASSWORD', // .env, SERVER_53_PASSWORD="yourpassowrd"
      commands: [
        /* ... */
      ],
    },
    staging: {
      name: '测试服务器',
      host: '127.215.84.54',
      username: 'deploy',
      passwordEnv: 'SERVER_54_PASSWORD', // .env, SERVER_54_PASSWORD="yourpassowrd"
      commands: [
        /* ... */
      ],
    },
    prod: {
      name: '生产服务器',
      host: '127.215.84.55',
      username: 'deploy',
      passwordEnv: 'SERVER_55_PASSWORD', // .env, SERVER_55_PASSWORD="yourpassowrd"
      commands: [
        /* ... */
      ],
    },
  },
};
```

## 部署命令

指定服务器进行部署：

```bash
wukong-deploy deploy dev    # 部署到开发服务器
wukong-deploy deploy prod   # 部署到生产服务器
```
