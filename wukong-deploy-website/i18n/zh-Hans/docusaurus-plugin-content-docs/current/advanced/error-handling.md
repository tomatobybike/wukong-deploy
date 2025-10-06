---
sidebar_position: 2
---

# 错误处理

wukong-deploy 提供了灵活的错误处理机制，帮助您更好地管理部署过程中可能出现的问题。

## 错误处理配置

每个命令都可以配置自己的错误处理策略：

```javascript
{
  cmd: "npm run build",
  description: "构建项目",
  exitOnStdErr: false,    // 是否在遇到错误时退出
  errorMatch: [           // 错误匹配模式
    /Error:/i,
    /Failed to compile/i
  ]
}
```

## 配置选项

### exitOnStdErr

- `true`: 任何写入 stderr 的内容都会被视为错误
- `false`: 允许写入 stderr 的内容，配合 errorMatch 使用

### errorMatch

支持字符串或正则表达式数组：

```javascript
errorMatch: /Error:/          // 单个正则表达式
errorMatch: [                 // 正则表达式数组
  /Error:/i,
  /Failed/i,
  /Exception/i
]
```

## 错误处理示例

### 1. NPM 构建错误处理

```javascript
{
  cmd: "npm run build",
  description: "构建项目",
  exitOnStdErr: false,
  errorMatch: [
    /Failed to compile/,
    /Error in/,
    /Module not found/
  ]
}
```

### 2. Git 操作错误处理

```javascript
{
  cmd: "git pull",
  description: "更新代码",
  exitOnStdErr: false,
  errorMatch: [
    /Authentication failed/,
    /Merge conflict/,
    /Please commit your changes/
  ]
}
```

### 3. 数据库操作错误处理

```javascript
{
  cmd: "npm run migrate",
  description: "数据库迁移",
  exitOnStdErr: false,
  errorMatch: [
    /Connection refused/,
    /Duplicate entry/,
    /Access denied/
  ]
}
```

## 最佳实践

1. 为每个命令设置具体的错误匹配模式
2. 对非关键命令设置 `exitOnStdErr: false`
3. 使用正则表达式匹配常见错误模式
4. 添加清晰的错误描述信息
