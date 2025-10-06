---
sidebar_position: 1
---

# Introduction

## What is wukong-deploy?

wukong-deploy is a lightweight Node.js-based deployment tool that helps you quickly deploy code to remote servers. Through simple configuration, you can execute a series of remote commands with a single click, making deployment automation easy.

## Features

- 🚀 One-command deployment to remote servers
- 🔐 Secure SSH and SCP support
- 📁 Flexible file and folder management
- 📦 Simple configuration file management
- 🌍 Multi-language support (English/Chinese)
- 🧪 Robust error handling mechanism

## Installation

Using npm:

```bash
npm install -g wukong-deploy
```

Or using yarn:

```bash
yarn global add wukong-deploy
```

## Basic Usage

1. Initialize configuration:

```bash
wukong-deploy init
```

2. Edit configuration file:

```javascript
// config/config.mjs
export default {
  servers: {
    dev: {
      name: "Development Server",
      host: "192.168.1.100",
      username: "root",
      passwordEnv: "SERVER_PASSWORD",
      commands: [
        {
          cmd: "git pull",
          cwd: "/path/to/project",
          description: "Update code"
        },
        {
          cmd: "npm install",
          cwd: "/path/to/project",
          description: "Install dependencies"
        }
      ]
    }
  }
}
```

3. Start deployment:

```bash
wukong-deploy deploy
```

## Next Steps

- Check out the [Configuration Guide](/docs/configuration) for more configuration options
- Learn about [Best Practices](/docs/best-practices) to optimize your deployment process
- Read [FAQ](/docs/faq) for common issues and solutions
