import { logger } from './logger.mjs'

export const showEnv = () => {
  logger.debug('env', {
    WUKONG_NO_EMOJI: process.env.WUKONG_NO_EMOJI,
    DEV_MODE: process.env.DEV_MODE,
    LANG: process.env.LANG,
    WUKONG_LANG: process.env.WUKONG_LANG,
    WUKONG_HIDE_HOST: process.env.WUKONG_HIDE_HOST
  })
}
