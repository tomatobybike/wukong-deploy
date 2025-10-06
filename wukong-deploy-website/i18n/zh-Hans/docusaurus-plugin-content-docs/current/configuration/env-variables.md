---
sidebar_position: 1
---

# 环境变量配置

wukong-deploy 支持通过环境变量来管理敏感信息和环境特定的配置。

## 基本使用

在配置文件中使用环境变量：

```javascript
export default {
  servers: {
    prod: {
      host: process.env.PROD_SERVER_HOST,
      username: process.env.PROD_SERVER_USER,
      passwordEnv: "PROD_SERVER_PASSWORD"
    }
  }
}
```

## 环境变量文件

wukong-deploy 支持 `.env` 文件：

```bash
# .env.development
PROD_SERVER_HOST=prod.example.com
PROD_SERVER_USER=deploy
PROD_SERVER_PASSWORD=your-secure-password
```

```bash
# .env.production
PROD_SERVER_HOST=prod.example.com
PROD_SERVER_USER=deploy
PROD_SERVER_PASSWORD=your-secure-password
```

## 多环境配置

您可以为不同环境创建不同的环境变量文件：

- `.env.development` - 开发环境
- `.env.staging` - 测试环境
- `.env.production` - 生产环境

使用特定环境的配置：

```bash
NODE_ENV=production wukong-deploy deploy
```

## 配置优先级

环境变量的加载优先级（从高到低）：

1. 命令行参数
2. 环境变量
3. `.env.local`
4. `.env.${NODE_ENV}`
5. `.env`

## 安全建议

1. 不要将 `.env` 文件提交到版本控制
2. 使用 `.env.example` 作为模板
3. 设置合适的文件权限
4. 定期更新密钥和密码
