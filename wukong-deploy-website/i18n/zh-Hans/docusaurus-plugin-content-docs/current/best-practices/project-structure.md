---
sidebar_position: 1
---

# 项目结构

一个良好的项目结构对于高效的部署至关重要。以下是推荐的项目结构：

```
project-root/
├── wukong.config.js       # 主配置文件
├── .env                   # 环境变量文件
├── scripts/              # 部署脚本目录
│   ├── pre-deploy.sh     # 部署前脚本
│   └── post-deploy.sh    # 部署后脚本
└── package.json          # 项目配置文件
```

## 配置文件组织

我们建议按环境组织配置：

```javascript
export default {
  // 全局设置
  defaults: {
    username: 'deploy',
    privateKey: '~/.ssh/id_rsa',
  },

  // 环境特定配置
  environments: {
    production: {
      servers: [
        {
          host: 'prod-server-1',
          commands: [/* ... */]
        }
      ]
    },
    staging: {
      servers: [
        {
          host: 'staging-server',
          commands: [/* ... */]
        }
      ]
    }
  }
}
```

## 最佳实践

1. **使用环境变量**
   - 将敏感信息存储在 `.env` 文件中
   - 为不同环境维护不同的 `.env` 文件

2. **命令组织**
   - 将相关命令组织在一起
   - 使用描述性注释

3. **脚本组织**
   - 将部署脚本放在专门的目录中
   - 使用有意义的命名规范

4. **版本控制**
   - 在版本控制中包含配置模板
   - 排除敏感文件（如 `.env`）
