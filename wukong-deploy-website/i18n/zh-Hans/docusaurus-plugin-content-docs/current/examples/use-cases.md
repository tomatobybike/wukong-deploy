---
sidebar_position: 1
---

# 使用实例

这里提供了一些常见场景的配置示例，帮助您快速上手 wukong-deploy。

## 前端项目部署

```javascript
export default {
  servers: {
    prod: {
      name: "前端生产服务器",
      host: "frontend.example.com",
      username: "deploy",
      commands: [
        {
          cmd: "cd /var/www/frontend",
          description: "进入项目目录"
        },
        {
          cmd: "git pull origin main",
          description: "更新代码"
        },
        {
          cmd: "npm install",
          description: "安装依赖"
        },
        {
          cmd: "npm run build",
          description: "构建项目"
        },
        {
          cmd: "nginx -s reload",
          description: "重启 Nginx"
        }
      ]
    }
  }
}
```

## Node.js 服务部署

```javascript
export default {
  servers: {
    prod: {
      name: "Node.js 生产服务器",
      host: "api.example.com",
      username: "deploy",
      commands: [
        "cd /var/www/api",
        "git pull origin main",
        "npm ci",
        "npm run build",
        "pm2 restart app"
      ]
    }
  }
}
```

## 数据库迁移

```javascript
export default {
  servers: {
    db: {
      name: "数据库服务器",
      host: "db.example.com",
      username: "dbadmin",
      commands: [
        "cd /var/www/app",
        "npm run migrate"
      ]
    }
  }
}
```

## Docker 容器部署

```javascript
export default {
  servers: {
    docker: {
      name: "Docker 服务器",
      host: "docker.example.com",
      username: "deploy",
      commands: [
        "cd /opt/app",
        "docker-compose pull",
        "docker-compose up -d"
      ]
    }
  }
}
```

## 静态网站部署

```javascript
export default {
  servers: {
    static: {
      name: "静态网站服务器",
      host: "static.example.com",
      username: "webadmin",
      commands: [
        "cd /var/www/html",
        "git pull origin main",
        "npm install",
        "npm run build",
        {
          cmd: "rsync -av --delete dist/ /var/www/html/",
          description: "同步构建文件到网站目录"
        }
      ]
    }
  }
}
```
