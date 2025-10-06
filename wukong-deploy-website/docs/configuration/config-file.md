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
| cwd | string | 工作目录 | - |
| description | string | 命令描述 | - |
| exitOnStdErr | boolean | 遇到错误是否退出 | true |
| errorMatch | RegExp | 错误匹配正则 | - |
| isLocal | boolean | 是否本地执行 | false |

## 完整示例

```javascript
export default {
  showCommandLog: true,
  servers: {
    dev: {
      name: "开发服务器",
      host: "192.168.1.100",
      username: "root",
      passwordEnv: "SERVER_DEV_PASSWORD",
      commands: [
        {
          cmd: "git pull",
          cwd: "/var/www/app",
          description: "更新代码",
          exitOnStdErr: false
        },
        {
          cmd: "npm install",
          cwd: "/var/www/app",
          description: "安装依赖"
        },
        {
          cmd: "npm run build",
          cwd: "/var/www/app",
          description: "构建项目"
        },
        {
          cmd: "pm2 restart app",
          cwd: "/var/www/app",
          description: "重启服务"
        }
      ],
      finishMsg: "🎉 开发环境部署完成！"
    },
    prod: {
      name: "生产服务器",
      host: "10.0.0.1",
      username: "deploy",
      passwordEnv: "SERVER_PROD_PASSWORD",
      commands: [
        {
          cmd: "git pull origin main",
          cwd: "/var/www/production",
          description: "更新主分支代码"
        },
        {
          cmd: "npm ci",
          cwd: "/var/www/production",
          description: "安装依赖（生产环境）"
        }
      ],
      finishMsg: "🚀 生产环境部署完成！"
    }
  }
}
```
