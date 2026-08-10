---
sidebar_position: 1
---

# 环境变量配置

wukong-deploy 支持通过环境变量来管理敏感信息和环境特定的配置。

## 基本使用

在配置文件中使用环境变量：

```javascript
// config.mjs
export default {
  servers: {
    prod: {
      host: '127.34.5.53',
      username: 'root',
      passwordEnv: 'PROD_SERVER_PASSWORD', // .env.wukong PROD_SERVER_PASSWORD="你的密码"
    },
  },
};
```

## 环境变量文件

wukong-deploy 会从 `.env.wukong`（由 `wukong-deploy init` 生成）中加载环境变量：

```bash
# .env.wukong

PROD_SERVER_PASSWORD=your-secure-password
```

此外还支持以下文件，按优先级顺序加载（见下文）：

```bash
# .env.dev        — 指定环境的覆盖文件（如 wukong-deploy deploy dev）
# .env.wukong     — 由 `wukong-deploy init` 生成的默认文件
# .env            — 旧版文件（仍作为回退读取）
```

使用特定环境的配置：

```bash
NODE_ENV=production wukong-deploy deploy
```

## 加载优先级

环境变量的加载优先级（从高到低）为：

1. 命令行参数
2. 环境变量（shell 导出）
3. `.env.{target}`（如 `.env.dev`、`.env.prod`）—— 指定环境的覆盖
4. `.env.wukong` —— 由 `wukong-deploy init` 生成的默认文件
5. `.env` —— 旧版回退（仅当上述文件均不存在时使用）

## 兼容性

> 在 v1.2.42 之前使用 `.env`。当前版本仍会读取 `.env` 作为回退，但 `.env.wukong`（由 `wukong-deploy init` 生成）优先级更高。你也可以提供指定环境的 `.env.{target}`（如 `.env.dev`）来覆盖某个服务器的变量。

## 安全建议

1. 不要将 `.env`、`.env.wukong` 或 `.env.{target}` 文件提交到版本控制
2. 使用 `.env.example`（或 `.env.wukong.example`）作为模板
3. 设置合适的文件权限
4. 定期更新密钥和密码
