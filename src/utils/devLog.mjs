import { logger } from './logger.mjs'

export const isDev = process.env.DEV_MODE === '1'

/**
 * 开发环境下输出调试信息
 * 推荐用于局部调试
 */
export function devLog(...args) {
  if (isDev) {
    logger.debug(args.join(' '))
  }
}
