---
sidebar_position: 1
---

# 配置文件

## 配置文件结构

wukong-deploy 使用 `config/config.mjs` 作为主要配置文件。这是一个 ES Module 文件，需要默认导出一个配置对象。

基本结构如下：

```javascript
export default {
  showCommandLog: true,  // 是否显示命令执行日志
  servers: {
    dev: {  // 服务器配置键名
      name: "开发服务器",  // 服务器描述名称
      host: "192.168.1.100",  // 服务器地址
      username: "root",  // SSH 用户名
      passwordEnv: "SERVER_PASSWORD",  // 密码环境变量名
      commands: [  // 要执行的命令列表
        {
          cmd: "git pull",  // 要执行的命令
          cwd: "/path/to/project",  // 工作目录
          description: "更新代码",  // 命令描述
          exitOnStdErr: false,  // 遇到错误是否退出
          errorMatch: /Permission denied/  // 错误匹配模式
        }
      ],
      finishMsg: "🎉 部署完成"  // 完成时的提示信息
    }
  }
}
```

## 服务器配置

每个服务器配置包含以下字段：

| 字段名 | 类型 | 说明 | 必填 |
|--------|------|------|------|
| name | string | 服务器描述名称 | 是 |
| host | string | 服务器地址 | 是 |
| username | string | SSH 用户名 | 是 |
| passwordEnv | string | 密码环境变量名 | 是 |
| commands | array | 命令列表 | 是 |
| finishMsg | string | 完成提示信息 | 否 |

## 命令配置

每个命令对象支持以下配置：

| 字段名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| cmd | string | 要执行的命令 | - |
| cwd | string | 工作目录。SSH 远程命令为服务器上的 pwd；本地命令（`isLocal: true`）若省略则默认为本地当前目录。 | - |
| description | string | 命令描述 | - |
| exitOnStdErr | boolean | 遇到错误是否退出 | true |
| errorMatch | RegExp | 错误匹配模式 | - |
| isLocal | boolean | 在本地执行命令，而非远程服务器 | false |
| upload | object | SPA 上传配置（见下文） | - |

### 上传命令（SPA 前端部署）（version >=1.2.42）

对于 SPA（单页应用）项目，可以使用 `upload` 命令类型，将本地构建产物压缩后上传到服务器并自动解压：

```javascript
{
  upload: {
    local: './dist',                 // 待上传的本地目录
    remote: '/www/wwwroot/app/dist/', // 远程目标目录
    backup: true,                     // 覆盖前备份已有远程目录
    format: 'tar'                     // 备份格式：'tar'（默认，tar.gz）或 'zip'
  },
  description: '压缩并上传 dist'
}
```

| 字段名 | 类型 | 说明 | 默认值 |
|--------|------|------|--------|
| local | string | 待压缩并上传的本地目录 | - |
| remote | string | 远程目标目录 | - |
| backup | boolean | 覆盖前备份已有远程目录 | false |
| format | string | 备份压缩格式：`tar`（tar.gz）或 `zip` | `tar` |

上传流程：

1. **备份**（当 `backup: true`）：将已有远程目录备份为 `dist_backup_<timestamp>.tar.gz`（或 `.zip`，取决于 `format`）
2. **压缩**本地目录为 `.zip`（跨平台，使用 Node.js `archiver`）
3. **上传**该 zip 文件到服务器 `/tmp`
4. **解压**到目标路径（使用 `unzip -o`，缺失时自动安装 `unzip`）
5. **清理**本地与远程的临时 zip 文件

## SPA 前端部署示例（version >=1.2.42）

本地构建并将 `dist` 产物上传到服务器的完整部署示例：

```javascript
export default {
  servers: {
    dev: {
      name: '开发服务器',
      host: '123.45.67.89',
      username: 'root',
      passwordEnv: 'SERVER_DEV_PASSWORD',
      commands: [
        {
          cmd: 'rm -rf dist/',
          isLocal: true,
          description: '清理本地 dist'
        },
        {
          cmd: 'pnpm run build:dev',
          isLocal: true,
          description: '构建项目'
        },
        {
          upload: {
            local: './dist',
            remote: '/www/wwwroot/ai/dist/',
            backup: true,
            format: 'tar'
          },
          description: '压缩并上传 dist'
        }
      ],
      finishMsg: '🎉 部署完成'
    }
  }
}
```
