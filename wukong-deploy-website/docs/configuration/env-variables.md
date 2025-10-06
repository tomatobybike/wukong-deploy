---
sidebar_position: 2
---

# 环境变量

wukong-deploy 支持多种环境变量配置，用于控制工具行为和存储敏感信息。

## 核心环境变量

以下是 wukong-deploy 支持的核心环境变量：

| 变量名 | 说明 | 可选值 | 默认值 |
|--------|------|--------|--------|
| WUKONG_DEV_MODE | 开发者模式 | 0/1 | 0 |
| WUKONG_LANG | 界面语言 | zh/en | 自动检测 |
| WUKONG_NO_EMOJI | 禁用表情符号 | 0/1 | 0 |
| WUKONG_DEBUG | 调试模式 | 0/1 | 0 |

## 服务器密码变量

在配置文件中通过 `passwordEnv` 字段指定的环境变量名，用于存储服务器密码：

```bash
# .env
SERVER_DEV_PASSWORD=your_password
SERVER_PROD_PASSWORD=your_password
```

## 设置环境变量

1. 通过 .env 文件（推荐）：

```bash
# .env
WUKONG_DEV_MODE=1
WUKONG_LANG=zh
SERVER_DEV_PASSWORD=your_password
```

2. 通过命令行临时设置：

```bash
WUKONG_LANG=en wukong-deploy deploy
```

3. 通过 shell 配置文件永久设置：

```bash
# ~/.bashrc 或 ~/.zshrc
export WUKONG_LANG=zh
export WUKONG_NO_EMOJI=1
```

## 开发者模式

开启开发者模式（WUKONG_DEV_MODE=1）后：

- 显示详细的命令执行日志
- 显示错误堆栈信息
- 保留临时文件以便调试

## 调试模式

开启调试模式（WUKONG_DEBUG=1）后：

- 显示内部调试信息
- 记录详细的执行过程
- 输出更多错误细节

## 语言设置

WUKONG_LANG 环境变量用于强制指定界面语言：

```bash
# 使用中文界面
WUKONG_LANG=zh

# Use English interface
WUKONG_LANG=en
```

如果不设置，将根据系统语言自动选择。

## Windows 特别说明

在 Windows 系统中，某些终端（如 CMD）对表情符号支持不好，建议设置：

```bash
WUKONG_NO_EMOJI=1
```
