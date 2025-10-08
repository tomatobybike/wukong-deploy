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
      passwordEnv: 'PROD_SERVER_PASSWORD', // .env PROD_SERVER_PASSWORD="你的密码"
    },
  },
};
```

## 环境变量文件

wukong-deploy 支持 `.env` 文件：

```bash
# .env.development

PROD_SERVER_PASSWORD=your-secure-password
```

使用特定环境的配置：

```bash
NODE_ENV=production wukong-deploy deploy
```

## 安全建议

1. 不要将 `.env` 文件提交到版本控制
2. 使用 `.env.example` 作为模板
3. 设置合适的文件权限
4. 定期更新密钥和密码
