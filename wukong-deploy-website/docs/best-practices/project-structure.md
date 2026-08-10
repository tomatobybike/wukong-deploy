---
sidebar_position: 1
---

# Project Structure

A well-organized project structure is crucial for efficient deployment. Below is a recommended project structure:

```
project-root/
├── .env.wukong            # Environment variables file（server password）
├── backup/                # Backup .env.wukong && config.mjs directory
│   ├── .env.wukong       # Backup .env.wukong
│   ├── config.mjs         # Backup config.mjs
├── config/                # Deployment config directory
│   ├── config.mjs         # config
├── logs/                  # Deployment logs directory
│   ├── 2020-08-08/     # year-month-day logs directory
│       ├── wukong.log     # log
```

## Best Practices

1. **Use Environment Variables**
   - Store sensitive information in `.env.wukong` files
