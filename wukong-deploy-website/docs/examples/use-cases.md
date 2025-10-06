---
sidebar_position: 1
---

# 使用示例

本文档通过具体示例展示如何使用 wukong-deploy 来处理不同的部署场景。

## 基础示例：部署前端应用

这个示例展示如何部署一个典型的前端应用：

```javascript
// config/config.mjs
export default {
  servers: {
    prod: {
      name: "生产服务器",
      host: "example.com",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        {
          cmd: "cd /var/www/app && git pull",
          description: "拉取最新代码"
        },
        {
          cmd: "npm ci",
          cwd: "/var/www/app",
          description: "安装依赖"
        },
        {
          cmd: "npm run build",
          cwd: "/var/www/app",
          description: "构建应用"
        },
        {
          cmd: "cp -r dist/* /var/www/html/",
          description: "部署构建文件"
        }
      ]
    }
  }
}
```

## 高级示例：多环境部署

这个示例展示如何配置多环境部署：

```javascript
// config/config.mjs
export default {
  servers: {
    dev: {
      name: "开发环境",
      host: "dev.example.com",
      username: "deploy",
      passwordEnv: "SERVER_DEV_PASSWORD",
      commands: [
        {
          cmd: "git checkout develop",
          cwd: "/var/www/app",
          description: "切换到开发分支"
        },
        {
          cmd: "git pull",
          cwd: "/var/www/app",
          description: "更新代码"
        },
        {
          cmd: "npm install",
          cwd: "/var/www/app",
          description: "安装依赖"
        }
      ]
    },
    staging: {
      name: "预发环境",
      host: "staging.example.com",
      username: "deploy",
      passwordEnv: "SERVER_STAGING_PASSWORD",
      commands: [
        {
          cmd: "git checkout staging",
          cwd: "/var/www/app",
          description: "切换到预发分支"
        },
        {
          cmd: "git pull",
          cwd: "/var/www/app",
          description: "更新代码"
        }
      ]
    },
    prod: {
      name: "生产环境",
      host: "example.com",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        {
          cmd: "git checkout main",
          cwd: "/var/www/app",
          description: "切换到主分支"
        },
        {
          cmd: "git pull",
          cwd: "/var/www/app",
          description: "更新代码"
        }
      ]
    }
  }
}
```

## Node.js 应用部署示例

这个示例展示如何部署 Node.js 应用：

```javascript
// config/config.mjs
export default {
  servers: {
    prod: {
      name: "生产服务器",
      host: "example.com",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        // 更新代码
        {
          cmd: "git pull origin main",
          cwd: "/var/www/app",
          description: "更新代码"
        },
        // 安装依赖
        {
          cmd: "npm ci --production",
          cwd: "/var/www/app",
          description: "安装生产依赖"
        },
        // 构建
        {
          cmd: "npm run build",
          cwd: "/var/www/app",
          description: "构建应用"
        },
        // 数据库迁移
        {
          cmd: "npm run migrate",
          cwd: "/var/www/app",
          description: "执行数据库迁移"
        },
        // 重启服务
        {
          cmd: "pm2 reload app",
          cwd: "/var/www/app",
          description: "重启应用"
        }
      ],
      // 添加错误处理
      errorMatch: [
        /Error:/,
        /failed/i,
        /error/i
      ]
    }
  }
}
```

## 使用本地命令示例

这个示例展示如何结合使用远程命令和本地命令：

```javascript
// config/config.mjs
export default {
  servers: {
    prod: {
      name: "生产服务器",
      host: "example.com",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        // 本地构建
        {
          cmd: "npm run build",
          description: "本地构建",
          isLocal: true
        },
        // 本地打包
        {
          cmd: "tar -czf dist.tar.gz dist/",
          description: "打包构建文件",
          isLocal: true
        },
        // 远程部署
        {
          cmd: "rm -rf /var/www/backup && mv /var/www/html /var/www/backup",
          description: "备份当前版本"
        },
        {
          cmd: "tar -xzf dist.tar.gz -C /var/www/html",
          description: "解压新版本"
        },
        // 本地清理
        {
          cmd: "rm dist.tar.gz",
          description: "清理本地文件",
          isLocal: true
        }
      ]
    }
  }
}
```

## 自定义错误处理示例

这个示例展示如何配置自定义错误处理：

```javascript
// config/config.mjs
export default {
  servers: {
    prod: {
      name: "生产服务器",
      host: "example.com",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        {
          cmd: "npm ci",
          cwd: "/var/www/app",
          description: "安装依赖",
          exitOnStdErr: false,  // 允许 stderr 输出
          errorMatch: [
            /error/i,  // 匹配错误信息
            /failed/i, // 匹配失败信息
            /ENOENT/   // 匹配文件不存在错误
          ]
        },
        {
          cmd: "npm run build",
          cwd: "/var/www/app",
          description: "构建应用",
          exitOnStdErr: true,   // 遇到错误立即退出
          errorMatch: /Failed to compile/  // 匹配编译错误
        }
      ]
    }
  }
}
```

## 执行效果预览

以下是使用 wukong-deploy 执行部署时的终端界面预览：

![部署预览](../../static/img/demo.svg)

## 在线演示

您可以通过以下步骤体验 wukong-deploy：

1. 在线尝试（无需安装）：

   ```bash
   npx wukong-deploy@latest init
   ```

2. 查看演示视频：

   访问我们的 [B站账号](https://space.bilibili.com/) 观看完整教程

## 常见问题排查示例

1. 连接失败

   ```bash
   # 检查服务器连通性
   wukong-deploy doctor

   # 输出详细日志
   WUKONG_DEBUG=1 wukong-deploy deploy
   ```

2. 权限问题

   ```bash
   # 确认目标目录权限
   ls -la /var/www/app

   # 使用 sudo 执行命令
   {
     cmd: "sudo npm run build",
     description: "构建应用"
   }
   ```

3. Node.js 版本问题

   ```bash
   # 在命令中指定 Node.js 版本
   {
     cmd: "source ~/.nvm/nvm.sh && nvm use 16 && npm run build",
     description: "使用 Node.js 16 构建"
   }
   ```

