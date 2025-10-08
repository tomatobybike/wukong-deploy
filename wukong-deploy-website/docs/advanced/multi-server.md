---
sidebar_position: 1
---

# Multi-Server Deployment

**wukong-deploy** supports deploying to multiple servers simultaneously, allowing you to easily manage multi-environment deployments.

## Basic Configuration

Configure multiple servers in `wukong.config.js`:

```javascript
export default {
  servers: {
    dev: {
      name: 'Development Server',
      host: '127.215.84.53',
      username: 'root',
      passwordEnv: 'SERVER_53_PASSWORD', // .env, SERVER_53_PASSWORD="你的密码"
      commands: [
        /* ... */
      ],
    },
    staging: {
      name: 'Staging Server',
      host: '127.215.84.54',
      username: 'deploy',
      passwordEnv: 'SERVER_54_PASSWORD', // .env, SERVER_54_PASSWORD="你的密码"
      commands: [
        /* ... */
      ],
    },
    prod: {
      name: 'Production Server',
      host: '127.215.84.54',
      username: 'deploy',
      passwordEnv: 'SERVER_53_PASSWORD', // .env, SERVER_55_PASSWORD="你的密码"
      commands: [
        /* ... */
      ],
    },
  },
};
```

## Deployment Commands

Specify a target server for deployment:

```bash
wukong-deploy deploy dev    # Deploy to the development server
wukong-deploy deploy prod   # Deploy to the production server
```

Deploy to multiple servers at once:

```bash
wukong-deploy deploy dev staging   # Deploy to both development and staging servers
wukong-deploy deploy all           # Deploy to all configured servers
```

## Best Practices

1. Use environment variables to manage configurations for different servers
2. Define different command sequences for each environment
3. Use server groups to simplify management
4. Plan the deployment order strategically for smooth rollouts
