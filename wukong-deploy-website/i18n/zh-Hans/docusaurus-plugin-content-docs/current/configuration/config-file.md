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
