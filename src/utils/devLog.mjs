/**
 * @file: devLog.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-04 16:25
 */
import dotenv from 'dotenv'

import { logger } from './logger.mjs'

dotenv.config()
const isDev = process.env.WUKONG_DEV_MODE === '1'

/**
 * 开发环境下输出调试信息
 * 推荐用于局部调试
 */
export function devLog(...args) {
  if (isDev) {
    const msg = args.join(' ')
    logger.debug(msg)
  }
}
