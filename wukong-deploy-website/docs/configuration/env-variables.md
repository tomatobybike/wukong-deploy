---
sidebar_position: 1
---

# Environment Variable Configuration

**wukong-deploy** supports managing sensitive information and environment-specific settings through environment variables.

## Basic Usage

Use environment variables in the configuration file:

```javascript
// config.mjs
export default {
  servers: {
    prod: {
      host: '127.34.5.53',
      username: 'root',
      passwordEnv: 'PROD_SERVER_PASSWORD', // .env PROD_SERVER_PASSWORD="yourpassword"
    },
  },
};
```

## Environment Variable Files

**wukong-deploy** supports `.env` files:

```bash
# .env.development

PROD_SERVER_PASSWORD=your-secure-password
```

## Configuration Priority

The loading priority of environment variables (from highest to lowest) is:

1. Command-line arguments
2. Environment variables
3. `.env`

## Security Recommendations

1. Do not commit `.env` files to version control
2. Use `.env.example` as a template
3. Set appropriate file permissions
4. Regularly update keys and passwords
