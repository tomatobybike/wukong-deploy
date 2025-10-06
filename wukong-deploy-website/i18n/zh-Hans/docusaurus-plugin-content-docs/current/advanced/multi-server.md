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
      name: "开发服务器",
      host: "dev.example.com",
      username: "root",
      commands: [/* ... */]
    },
    staging: {
      name: "测试服务器",
      host: "staging.example.com",
      username: "deploy",
      commands: [/* ... */]
    },
    prod: {
      name: "生产服务器",
      host: "prod.example.com",
      username: "deploy",
      commands: [/* ... */]
    }
  }
}
```

## 部署命令

指定服务器进行部署：

```bash
wukong-deploy deploy dev    # 部署到开发服务器
wukong-deploy deploy prod   # 部署到生产服务器
```

同时部署到多台服务器：

```bash
wukong-deploy deploy dev staging   # 部署到开发和测试服务器
wukong-deploy deploy all           # 部署到所有服务器
```

## 服务器组配置

您可以将服务器分组管理：

```javascript
export default {
  groups: {
    webservers: ['web1', 'web2', 'web3'],
    dbservers: ['db1', 'db2']
  },
  servers: {
    web1: { /* ... */ },
    web2: { /* ... */ },
    web3: { /* ... */ },
    db1: { /* ... */ },
    db2: { /* ... */ }
  }
}
```

使用服务器组部署：

```bash
wukong-deploy deploy webservers  # 部署到所有 web 服务器
```

## 部署顺序控制

您可以控制多服务器部署的执行顺序：

```javascript
export default {
  deployOrder: ['db1', 'web1', 'web2', 'web3'],
  servers: {
    web1: { /* ... */ },
    web2: { /* ... */ },
    web3: { /* ... */ },
    db1: { /* ... */ }
  }
}
```

## 最佳实践

1. 使用环境变量管理不同服务器的配置
2. 为不同环境设置不同的命令队列
3. 利用服务器组简化管理
4. 合理规划部署顺序
