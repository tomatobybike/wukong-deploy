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
      name: '前端生产服务器',
      host: 'frontend.example.com',
      username: 'deploy',
      passwordEnv: 'SERVER_DEV_PASSWORD', // Password environment variable .env
      commands: [
        {
          cmd: 'git pull origin main',
          cwd: '/path/to/project',
          description: '更新代码',
        },
        {
          cmd: 'npm install',
          cwd: '/path/to/project',
          description: '安装依赖',
        },
        {
          cmd: 'npm run build',
          cwd: '/path/to/project',
          description: '构建项目',
        },
        {
          cmd: 'nginx -s reload',
          cwd: '/path/to/project',
          description: '重启 Nginx',
        },
      ],
    },
  },
};
```

## Node.js 服务部署

```javascript
export default {
  servers: {
    prod: {
      name: 'Node.js 生产服务器',
      host: 'api.example.com',
      username: 'deploy',
      passwordEnv: 'SERVER_DEV_PASSWORD', // Password environment variable .env
      commands: [
        {
          cmd: 'git pull origin main',
          cwd: '/var/www/api',
          description: 'git pull',
        },
        {
          cmd: 'npm ci',
          cwd: '/var/www/api',
          description: 'npm cli',
        },
        {
          cmd: 'npm run build',
          cwd: '/var/www/api',
          description: 'build',
        },
        {
          cmd: 'pm2 restart app',
          cwd: '/var/www/api',
          description: 'restart',
        },
      ],
    },
  },
};
```

## 数据库迁移

```javascript
export default {
  servers: {
    db: {
      name: '数据库服务器',
      host: 'db.example.com',
      username: 'dbadmin',
      passwordEnv: 'SERVER_DEV_PASSWORD', // Password environment variable .env
      commands: [
        {
          cmd: 'npm run migrate',
          cwd: '/var/www/app',
          description: 'migrate',
        },
      ],
    },
  },
};
```

## Docker 容器部署

```javascript
export default {
  servers: {
    docker: {
      name: 'Docker 服务器',
      host: 'docker.example.com',
      username: 'deploy',
      passwordEnv: 'SERVER_DEV_PASSWORD', // Password environment variable .env
      commands: [
        {
          cmd: 'docker-compose pull',
          cwd: '/opt/app',
          description: 'pull',
        },
        {
          cmd: 'docker-compose up -d',
          cwd: '/opt/app',
          description: 'up',
        },
      ],
    },
  },
};
```

## 静态网站部署

```javascript
export default {
  servers: {
    static: {
      name: '静态网站服务器',
      host: 'static.example.com',
      username: 'webadmin',
      passwordEnv: 'SERVER_DEV_PASSWORD', // Password environment variable .env
      commands: [
        {
          cmd: 'git pull origin main',
          cwd: '/var/www/html',
          description: 'git pull',
        },
        {
          cmd: 'npm install',
          cwd: '/var/www/html',
          description: 'install',
        },
        {
          cmd: 'npm run build',
          cwd: '/var/www/html',
          description: 'build',
        },
        {
          cmd: 'rsync -av --delete dist/ /var/www/html/',
          cwd: '/var/www/html',
          description: '同步构建文件到网站目录',
        },
      ],
    },
  },
};
```
