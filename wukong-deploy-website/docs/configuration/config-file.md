---
sidebar_position: 1
---

# Configuration File

## File Structure

wukong-deploy uses `config/config.mjs` as its main configuration file. This is an ES Module file that should export a configuration object.

Basic structure:

```javascript
export default {
  showCommandLog: true,  // Show command execution logs
  servers: {
    dev: {  // Server configuration key
      name: "Development Server",  // Server description
      host: "192.168.1.100",  // Server address
      username: "root",  // SSH username
      passwordEnv: "SERVER_PASSWORD",  // Password environment variable
      commands: [  // List of commands to execute
        {
          cmd: "git pull",  // Command to execute
          cwd: "/path/to/project",  // Working directory
          description: "Update code",  // Command description
          exitOnStdErr: false,  // Exit on error
          errorMatch: /Permission denied/  // Error matching pattern
        }
      ],
      finishMsg: "🎉 Deployment complete"  // Completion message
    }
  }
}
```

## Server Configuration

Each server configuration contains the following fields:

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| name | string | Server description | Yes |
| host | string | Server address | Yes |
| username | string | SSH username | Yes |
| passwordEnv | string | Password environment variable | Yes |
| commands | array | Command list | Yes |
| finishMsg | string | Completion message | No |

## Command Configuration

Each command object supports the following configuration:

| Field Name | Type | Description | Default |
|------------|------|-------------|---------|
| cmd | string | Command to execute | - |
| cwd | string | Working directory | - |
| description | string | Command description | - |
| exitOnStdErr | boolean | Exit on error | true |
| errorMatch | RegExp | Error matching pattern | - |
| isLocal | boolean | Execute locally | false |
| upload | object | SPA upload configuration (see below) | - |

### Upload Command (SPA Frontend Deployment) (version >=1.2.42)

For SPA (Single Page Application) projects, you can use the `upload` command type to compress the local build output, upload it to the server, and extract it automatically:

```javascript
{
  upload: {
    local: './dist',                 // local directory to upload
    remote: '/www/wwwroot/app/dist/', // remote target directory
    backup: true,                    // backup existing remote dir before overwrite
    format: 'tar'                    // backup format: 'tar' (default, tar.gz) or 'zip'
  },
  description: 'Compress and upload dist'
}
```

| Field Name | Type | Description | Default |
|------------|------|-------------|---------|
| local | string | Local directory to compress and upload | - |
| remote | string | Remote target directory | - |
| backup | boolean | Back up the existing remote directory before overwriting | false |
| format | string | Backup archive format: `tar` (tar.gz) or `zip` | `tar` |

The upload pipeline:

1. **Backup** (if `backup: true`): backs up the existing remote directory as `dist_backup_<timestamp>.tar.gz` (or `.zip`, depending on `format`)
2. **Compress** the local directory to `.zip` (cross-platform, uses Node.js `archiver`)
3. **Upload** the zip file to the server `/tmp`
4. **Extract** with `unzip -o` to the target path (auto-installs `unzip` if missing)
5. **Cleanup** temporary zip files on both local and remote

## Complete Example

```javascript
export default {
  showCommandLog: true,
  servers: {
    dev: {
      name: "Development Server",
      host: "192.168.1.100",
      username: "root",
      passwordEnv: "SERVER_DEV_PASSWORD",
      commands: [
        {
          cmd: "git pull",
          cwd: "/var/www/app",
          description: "Update code",
          exitOnStdErr: false
        },
        {
          cmd: "npm install",
          cwd: "/var/www/app",
          description: "Install dependencies"
        },
        {
          cmd: "npm run build",
          cwd: "/var/www/app",
          description: "Build project"
        },
        {
          cmd: "pm2 restart app",
          cwd: "/var/www/app",
          description: "Restart service"
        }
      ],
      finishMsg: "🎉 Development environment deployment complete!"
    },
    prod: {
      name: "Production Server",
      host: "10.0.0.1",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        {
          cmd: "git pull origin main",
          cwd: "/var/www/production",
          description: "Update main branch code"
        },
        {
          cmd: "npm ci",
          cwd: "/var/www/production",
          description: "Install dependencies (production)"
        }
      ],
      finishMsg: "🚀 Production environment deployment complete!"
    }
  }
}
```

## SPA Frontend Deployment Example (version >=1.2.42)

A full SPA deployment that builds locally and uploads the `dist` output to the server:

```javascript
export default {
  servers: {
    dev: {
      name: 'Dev Server',
      host: '123.45.67.89',
      username: 'root',
      passwordEnv: 'SERVER_DEV_PASSWORD',
      commands: [
        {
          cmd: 'rm -rf dist/',
          isLocal: true,
          description: 'Clean local dist'
        },
        {
          cmd: 'pnpm run build:dev',
          isLocal: true,
          description: 'Build project'
        },
        {
          upload: {
            local: './dist',
            remote: '/www/wwwroot/ai/dist/',
            backup: true,
            format: 'tar'
          },
          description: 'Compress & upload dist'
        }
      ],
      finishMsg: '🎉 Deployment completed'
    }
  }
}
```
