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
      passwordEnv: 'SERVER_53_PASSWORD', // .env, SERVER_53_PASSWORD="yourpassowrd"
      commands: [
        /* ... */
      ],
    },
    staging: {
      name: 'Staging Server',
      host: '127.215.84.54',
      username: 'deploy',
      passwordEnv: 'SERVER_54_PASSWORD', // .env, SERVER_54_PASSWORD="yourpassowrd"
      commands: [
        /* ... */
      ],
    },
    prod: {
      name: 'Production Server',
      host: '127.215.84.55',
      username: 'deploy',
      passwordEnv: 'SERVER_55_PASSWORD', // .env, SERVER_55_PASSWORD="yourpassowrd"
      commands: [
        /* ... */
      ],
    },
  },
};
```

```bash
# .env

SERVER_53_PASSWORD="your-secure-password"

SERVER_54_PASSWORD="your-secure-password"

SERVER_55_PASSWORD="your-secure-password"
```

## Deployment Commands

```bash
wukong-deploy deploy        # choice server deploy 
```

Specify a target server for deployment:

```bash
wukong-deploy deploy dev    # Deploy to the development server
wukong-deploy deploy prod   # Deploy to the production server
```

## Best Practices

1. Use environment variables to manage configurations for different servers
2. Define different command sequences for each environment
3. Use server groups to simplify management
4. Plan the deployment order strategically for smooth rollouts
