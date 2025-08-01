import { i18nError } from './i18n.mjs'


/**
 * 校验 SSH 执行命令后的结果是否表示失败
 * @param {Object} result - node-ssh 返回的执行结果对象
 * @param {Object} cmdObj - 命令配置对象（来自 config.mjs）
 * @param {Object} logger - 用于输出日志的 logger 实例
 * @returns {boolean} 是否命令执行失败（true = 失败）
 */
export function validateCommandResult(result, cmdObj) {
  const {
    cmd, // 执行命令，如 'git pull'
    exitOnStdErr = false, // 如果 stderr 非空就失败
    errorMatch, // 可选：stderr 匹配正则时视为失败
    description = '' // 命令描述（可选）
  } = cmdObj

  let hasError = false

  // 1. 判断命令执行结果是否有错误码
  if (result.code !== 0) {
    hasError = true
    i18nError('command.exitCodeNotZero', { cmd, code: 1 })
  }

  // 2. 判断是否要求 stderr 视为错误
  if (exitOnStdErr && result.stderr) {
    hasError = true
    i18nError('command.stderrTreatedAsError', { cmd, code: 1 })
  }

  // 3. 判断 stderr 是否匹配特定错误模式（正则）
  if (
    errorMatch instanceof RegExp &&
    result.stderr &&
    errorMatch.test(result.stderr)
  ) {
    hasError = true
    i18nError('command.matchedErrorPattern', {
      cmd,
      code: 1,
      pattern: errorMatch
    })
  }

  // 统一输出失败信息
  if (hasError) {
    i18nError('command.commandFailed', {
      desc: description || cmd
    })
  }

  return hasError
}
