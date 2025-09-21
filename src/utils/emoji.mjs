/**
 * @file: emoji.mjs
 * @description:
 * ✅ 智能判断终端是否支持 Emoji，并提供统一包装函数和开关变量。
 *
 * 📌 支持判断逻辑说明：
 * 判断点	是否禁用 Emoji
 * WUKONG_NO_EMOJI=1	        ✅ 是（强制关闭）
 * WUKONG_NO_EMOJI=0	        ❌ 否（强制启用）
 * TERM=dumb（能力极差）	        ✅ 是
 * Windows + 非现代终端（无 WT_SESSION/TERM_PROGRAM） ✅ 是
 * Git Bash / Windows Terminal / VSCode Terminal / macOS / Linux	❌ 不禁用
 *
 * @author:
 * @created: 2025-08-05
 */
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config({ quiet: true })

// ========== 用户设置 ==========

// 用户通过环境变量控制 Emoji
const userForceSetting = process.env.WUKONG_NO_EMOJI

// ========== 终端和平台判断 ==========

// 判断终端是否为 dumb（极简终端）
const isDumb = () => process.env.TERM === 'dumb'

// 检测是否 Git Bash（支持 Emoji）
const isTrueGitBash = () =>
  process.platform === 'win32' &&
  process.env.SHELL?.toLowerCase().includes('bash')

// 判断是否为现代 Windows 终端（如 Windows Terminal 或 VSCode Terminal）
const isModernWindowsTerminal = () =>
  process.platform === 'win32' &&
  (process.env.WT_SESSION ||
    process.env.TERM_PROGRAM?.toLowerCase().includes('vscode'))

// ========== Emoji 渲染能力检测 ==========

// 尝试写入一个 emoji 判断 stdout 是否支持
const canRenderEmoji = () => {
  try {
    return process.stdout.isTTY && Buffer.from('✅', 'utf8').length > 1
  } catch {
    return false
  }
}

// ========== Emoji 启用判断 ==========

export const emojiEnabled =
  // eslint-disable-next-line no-nested-ternary
  userForceSetting === '0'
    ? true // 强制启用
    : userForceSetting === '1'
      ? false // 强制禁用
      : !isDumb() &&
        canRenderEmoji() &&
        (process.platform !== 'win32' ||
          isModernWindowsTerminal() ||
          isTrueGitBash())

/**
 * 包装 Emoji（根据环境决定是否返回 emoji 或备用字符）
 * @param {string} emoji - emoji 表情字符
 * @param {string} fallback - 替代字符（默认空字符串）
 * @returns {string}
 */
export function e(emoji, fallback = '') {
  return emojiEnabled ? emoji : fallback
}

// ========== 可选调试输出 ==========
/*
if (!emojiEnabled) {
  console.log('⚠️ 当前终端未启用 Emoji，已自动禁用（如需强制启用请设置 WUKONG_NO_EMOJI=0）')
}
*/
