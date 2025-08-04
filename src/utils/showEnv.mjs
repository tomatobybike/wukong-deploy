/**
 * @file: showEnv.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-04 17:17
 */

import { colors } from './colors.mjs'

export const showEnv = () => {
  const { env } = process
  console.log(colors.boldBlue('\n🧪  .env'))
  console.log(colors.gray('----------------------------------------'))
  console.log(`${colors.bold('WUKONG_NO_EMOJI')}: ${env.WUKONG_NO_EMOJI}`)
  console.log(`${colors.bold('WUKONG_DEV_MODE')}: ${env.WUKONG_DEV_MODE}`)
  console.log(`${colors.bold('LANG')}: ${env.LANG}`)
  console.log(`${colors.bold('WUKONG_LANG')}: ${env.WUKONG_LANG}`)
  console.log(`${colors.bold('WUKONG_HIDE_HOST')}: ${env.WUKONG_HIDE_HOST}`)
  console.log(colors.gray('----------------------------------------\n'))
}
