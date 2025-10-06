---
sidebar_position: 1
---

# 多服务器管理

本文将介绍如何使用 wukong-deploy 管理多个服务器的部署配置。

## 基本概念

在 wukong-deploy 中，您可以在配置文件中定义多个服务器配置，每个服务器可以有自己的：
- 连接信息（主机地址、用户名等）
- 命令队列
- 错误处理策略

## 配置示例

```javascript
export default {
  servers: {
    dev: {
      name: "开发服务器",
      host: "dev.example.com",
      username: "deploy",
      passwordEnv: "DEV_SERVER_PASSWORD",
      commands: [/* ... */]
    },
    staging: {
      name: "预发布服务器",
      host: "staging.example.com",
      username: "deploy",
      passwordEnv: "STAGING_SERVER_PASSWORD",
      commands: [/* ... */]
    },
    prod: {
      name: "生产服务器",
      host: "prod.example.com",
      username: "deploy",
      passwordEnv: "PROD_SERVER_PASSWORD",
      commands: [/* ... */]
    }
  }
}
```

## 使用方法

1. 部署到指定服务器：
```bash
wukong-deploy deploy dev    # 部署到开发服务器
wukong-deploy deploy prod   # 部署到生产服务器
```

2. 交互式选择：
```bash
wukong-deploy deploy   # 将提示选择要部署的服务器
```

## 环境变量配置

为每个服务器配置对应的密码环境变量：

```bash
# .env
DEV_SERVER_PASSWORD=your_dev_password
STAGING_SERVER_PASSWORD=your_staging_password
PROD_SERVER_PASSWORD=your_prod_password
```

## 最佳实践

1. 为不同环境使用不同的命令队列
2. 根据环境配置不同的错误处理策略
3. 使用环境变量管理敏感信息
4. 为每个服务器配置清晰的描述名称
