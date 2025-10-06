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
      host: 'dev.example.com',
      username: 'root',
      commands: [
        /* ... */
      ],
    },
    staging: {
      name: 'Staging Server',
      host: 'staging.example.com',
      username: 'deploy',
      commands: [
        /* ... */
      ],
    },
    prod: {
      name: 'Production Server',
      host: 'prod.example.com',
      username: 'deploy',
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

## Server Group Configuration

You can organize servers into groups for easier management:

```javascript
export default {
  groups: {
    webservers: ['web1', 'web2', 'web3'],
    dbservers: ['db1', 'db2'],
  },
  servers: {
    web1: {
      /* ... */
    },
    web2: {
      /* ... */
    },
    web3: {
      /* ... */
    },
    db1: {
      /* ... */
    },
    db2: {
      /* ... */
    },
  },
};
```

Deploy using a server group:

```bash
wukong-deploy deploy webservers  # Deploy to all web servers
```

## Deployment Order Control

You can control the execution order when deploying to multiple servers:

```javascript
export default {
  deployOrder: ['db1', 'web1', 'web2', 'web3'],
  servers: {
    web1: {
      /* ... */
    },
    web2: {
      /* ... */
    },
    web3: {
      /* ... */
    },
    db1: {
      /* ... */
    },
  },
};
```

## Best Practices

1. Use environment variables to manage configurations for different servers
2. Define different command sequences for each environment
3. Use server groups to simplify management
4. Plan the deployment order strategically for smooth rollouts
