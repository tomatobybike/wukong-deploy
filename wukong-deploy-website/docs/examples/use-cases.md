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
      host: 'frontend.example.com',
      username: 'deploy',
      commands: [
        {
          cmd: 'cd /var/www/frontend',
          description: 'Enter project directory',
        },
        {
          cmd: 'git pull origin main',
          description: 'Update code',
        },
        {
          cmd: 'npm install',
          description: 'Install dependencies',
        },
        {
          cmd: 'npm run build',
          description: 'Build project',
        },
        {
          cmd: 'nginx -s reload',
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
      host: 'api.example.com',
      username: 'deploy',
      commands: [
        'cd /var/www/api',
        'git pull origin main',
        'npm ci',
        'npm run build',
        'pm2 restart app',
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
      host: 'db.example.com',
      username: 'dbadmin',
      commands: ['cd /var/www/app', 'npm run migrate'],
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
      host: 'docker.example.com',
      username: 'deploy',
      commands: ['cd /opt/app', 'docker-compose pull', 'docker-compose up -d'],
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
      host: 'static.example.com',
      username: 'webadmin',
      commands: [
        'cd /var/www/html',
        'git pull origin main',
        'npm install',
        'npm run build',
        {
          cmd: 'rsync -av --delete dist/ /var/www/html/',
          description: 'Sync build files to website directory',
        },
      ],
    },
  },
};
```
