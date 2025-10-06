---
sidebar_position: 1
---

# 项目结构

本文介绍使用 wukong-deploy 时推荐的项目结构和文件组织方式。

## 基本结构

推荐的项目结构如下：

```
your-project/
├── config/
│   └── config.mjs     # wukong-deploy 配置文件
├── scripts/           # 部署相关的脚本
│   ├── build.sh
│   └── deploy.sh
├── .env              # 环境变量文件
└── package.json
```

## 配置文件组织

对于大型项目，可以将配置文件拆分为多个模块：

```
config/
├── config.mjs           # 主配置文件
├── servers/            # 服务器配置
│   ├── dev.mjs
│   ├── staging.mjs
│   └── prod.mjs
└── commands/           # 命令配置
    ├── build.mjs
    ├── deploy.mjs
    └── maintenance.mjs
```

## 环境变量管理

推荐的环境变量文件结构：

```
.env                # 默认环境变量（要加入 .gitignore）
.env.example        # 环境变量示例（可以提交到 Git）
.env.development    # 开发环境变量
.env.production     # 生产环境变量
```

## 服务器配置示例

分环境的服务器配置示例：

```javascript
// config/servers/dev.mjs
export default {
  name: "开发服务器",
  host: "dev.example.com",
  username: "deploy",
  passwordEnv: "SERVER_DEV_PASSWORD",
  commands: [/* ... */]
}

// config/servers/prod.mjs
export default {
  name: "生产服务器",
  host: "example.com",
  username: "deploy",
  passwordEnv: "SERVER_PROD_PASSWORD",
  commands: [/* ... */]
}

// config/config.mjs
import devServer from './servers/dev.mjs'
import prodServer from './servers/prod.mjs'

export default {
  servers: {
    dev: devServer,
    prod: prodServer
  }
}
```

## 命令组织

按功能模块组织命令：

```javascript
// config/commands/build.mjs
export const buildCommands = [
  {
    cmd: "npm run build",
    description: "构建项目"
  }
]

// config/commands/deploy.mjs
export const deployCommands = [
  {
    cmd: "pm2 reload all",
    description: "重启服务"
  }
]

// config/config.mjs
import { buildCommands } from './commands/build.mjs'
import { deployCommands } from './commands/deploy.mjs'

export default {
  servers: {
    dev: {
      // ...
      commands: [
        ...buildCommands,
        ...deployCommands
      ]
    }
  }
}
```

## 最佳实践建议

1. **配置文件分离**
   - 将不同环境的配置分开管理
   - 使用模块化的方式组织配置
   - 敏感信息使用环境变量

2. **错误处理**
   - 为重要命令配置 errorMatch
   - 合理设置 exitOnStdErr
   - 添加错误重试机制

3. **安全性**
   - 不要在代码中硬编码密码
   - 使用 .gitignore 排除敏感文件
   - 限制服务器用户权限

4. **可维护性**
   - 为命令添加清晰的描述
   - 使用有意义的配置键名
   - 保持配置文件的整洁和一致性
