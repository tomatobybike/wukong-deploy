---
sidebar_position: 1
---

# Usage Examples

Here are some common configuration examples to help you get started with **wukong-deploy**.

## Frontend Project Deployment

```javascript
export default {
  servers: {
    prod: {
      name: 'Frontend Production Server',
      host: '192.168.0.123',
      username: 'root',
      passwordEnv: 'SERVER_DEV_PASSWORD', // Password environment variable .env
      commands: [
        {
          cmd: 'git pull origin main',
          cwd: '/path/to/project',
          description: 'Update code',
        },
        {
          cmd: 'npm install',
          cwd: '/path/to/project',
          description: 'Install dependencies',
        },
        {
          cmd: 'npm run build',
          cwd: '/path/to/project',
          description: 'Build project',
        },
        {
          cmd: 'nginx -s reload',
          cwd: '/path/to/project',
          description: 'Reload Nginx',
        },
      ],
    },
  },
};
```

## Node.js Service Deployment

```javascript
export default {
  servers: {
    prod: {
      name: 'Node.js Production Server',
      host: '192.168.0.123',
      username: 'root',
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

## Database Migration

```javascript
export default {
  servers: {
    db: {
      name: 'Database Server',
      host: '192.168.0.123',
      username: 'root',
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

## Docker Container Deployment

```javascript
export default {
  servers: {
    docker: {
      name: 'Docker Server',
      host: '192.168.0.123',
      username: 'root',
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

## Static Website Deployment

```javascript
export default {
  servers: {
    static: {
      name: 'Static Website Server',
      host: '192.168.0.123',
      username: 'root',
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
          description: 'Sync build files to website directory',
        },
      ],
    },
  },
};
```
