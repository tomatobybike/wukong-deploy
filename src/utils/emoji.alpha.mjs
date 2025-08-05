/**
 * @file: emoji.mjs
 * @description:
 * ✅  智能判断终端是否支持 Emoji，并提供统一包装函数和开关变量。
 *
    环境变量判断（优先）

    终端类型判断（如 dumb）

    操作系统类型（如老版本 Windows）

    尝试写入 Emoji 到 stdout，检测是否能渲染（核心增强）
    📌 支持判断逻辑说明：
    判断点	是否禁用 Emoji
    WUKONG_NO_EMOJI=1	✅ 是
    Windows + 非 Windows Terminal	✅ 是
    TERM=dumb（能力极差）	✅ 是
    VSCode Terminal / macOS / Linux	✅ 不禁用
 * @author:
 * @created: 2025-08-02
 */
import process from 'node:process'

// ========== 配置项 ==========

// 优先用户配置显式禁用
const userDisabled = process.env.WUKONG_NO_EMOJI === '1'

// ========== 终端环境判断 ==========

// 判断终端是否 dumb
const isDumb = () => process.env.TERM === 'dumb'

// 检测是否 Git Bash（基于 TERM 和 SHELL）
const isGitBash = () =>
  process.platform === 'win32' &&
  process.env.SHELL?.toLowerCase().includes('bash') &&
  !process.env.TERM // Git Bash 有时 TERM 是 undefined

// 检测是否老旧 Windows Terminal（非 Windows Terminal / VSCode）
const isOldWindowsTerminal = () =>
  process.platform === 'win32' &&
  !process.env.WT_SESSION && // 非 Windows Terminal
  !process.env.TERM_PROGRAM?.toLowerCase().includes('vscode')

// ========== Emoji 渲染能力检测 ==========

// 检测 emoji 渲染能力（通过写入一个 emoji 看 stdout 支持不支持）
const canRenderEmoji = () => {
  try {
    return process.stdout.isTTY && Buffer.from('✅', 'utf8').length > 1
  } catch {
    return false
  }
}

// ========== 缓存判断结果 ==========

export const emojiEnabled =
  !userDisabled &&
  !isDumb() &&
  !isGitBash() &&
  !isOldWindowsTerminal() &&
  canRenderEmoji()

/**
 * 包装 Emoji（根据环境决定是否返回替代字符）
 * @param {string} emoji - emoji 表情字符
 * @param {string} fallback - 替代字符（默认空字符串）
 * @returns {string}
 */
export function e(emoji, fallback = '') {
  return emojiEnabled ? emoji : fallback
}

/*
import { e, emojiEnabled } from './utils/emoji.mjs'

console.log(`${e('🚀', '>')} 发布完成`)
if (!emojiEnabled) {
  console.log('⚠️ 当前终端不支持 Emoji，已自动禁用')
}
*/
