// utils/emoji.js
import os from 'os'

const isWindows = os.platform() === 'win32'
const disableEmoji =
  process.env.WUKONG_NO_EMOJI === '1' || (process.env.WUKONG_NO_EMOJI === undefined && isWindows)

/**
 * 安全输出 emoji 或 fallback 文本
 * @param {string} emoji - emoji 表情
 * @param {string} fallback - 替代文本（默认空字符串）
 * @returns {string}
 */
export function e(emoji, fallback = '') {
  return disableEmoji ? fallback : emoji
}
