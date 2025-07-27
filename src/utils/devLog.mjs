export const isDev = process.env.DEV_MODE === '1'

/**
 * 开发环境下输出调试信息
 * @param  {...any} args - 任意日志参数
 */
export function devLog(...args) {
  if (isDev) {
    console.log('[调试]', ...args)
  }
}
