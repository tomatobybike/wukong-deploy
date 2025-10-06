---
sidebar_position: 1
---

# Environment Variable Configuration

**wukong-deploy** supports managing sensitive information and environment-specific settings through environment variables.

## Basic Usage

Use environment variables in the configuration file:

```javascript
export default {
  servers: {
    prod: {
      host: process.env.PROD_SERVER_HOST,
      username: process.env.PROD_SERVER_USER,
      passwordEnv: 'PROD_SERVER_PASSWORD',
    },
  },
};
```

## Environment Variable Files

**wukong-deploy** supports `.env` files:

```bash
# .env.development
PROD_SERVER_HOST=prod.example.com
PROD_SERVER_USER=deploy
PROD_SERVER_PASSWORD=your-secure-password
```

```bash
# .env.production
PROD_SERVER_HOST=prod.example.com
PROD_SERVER_USER=deploy
PROD_SERVER_PASSWORD=your-secure-password
```

## Multi-Environment Configuration

You can create separate environment variable files for different environments:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Use a specific environment configuration:

```bash
NODE_ENV=production wukong-deploy deploy
```

## Configuration Priority

The loading priority of environment variables (from highest to lowest) is:

1. Command-line arguments
2. Environment variables
3. `.env.local`
4. `.env.${NODE_ENV}`
5. `.env`

## Security Recommendations

1. Do not commit `.env` files to version control
2. Use `.env.example` as a template
3. Set appropriate file permissions
4. Regularly update keys and passwords
