---
sidebar_position: 1
---

# Project Structure

A well-organized project structure is crucial for efficient deployment. Below is a recommended project structure:

```
project-root/
├── wukong.config.js       # Main configuration file
├── .env                   # Environment variables file
├── scripts/               # Deployment scripts directory
│   ├── pre-deploy.sh      # Pre-deployment script
│   └── post-deploy.sh     # Post-deployment script
└── package.json           # Project configuration file
```

## Configuration File Organization

We recommend organizing configurations by environment:

```javascript
export default {
  // Global settings
  defaults: {
    username: 'deploy',
    privateKey: '~/.ssh/id_rsa',
  },

  // Environment-specific configurations
  environments: {
    production: {
      servers: [
        {
          host: 'prod-server-1',
          commands: [
            /* ... */
          ],
        },
      ],
    },
    staging: {
      servers: [
        {
          host: 'staging-server',
          commands: [
            /* ... */
          ],
        },
      ],
    },
  },
};
```

## Best Practices

1. **Use Environment Variables**
   - Store sensitive information in `.env` files
   - Maintain separate `.env` files for different environments

2. **Command Organization**
   - Group related commands together
   - Use descriptive comments

3. **Script Organization**
   - Place deployment scripts in a dedicated directory
   - Use meaningful naming conventions

4. **Version Control**
   - Include configuration templates in version control
   - Exclude sensitive files (e.g., `.env`)
