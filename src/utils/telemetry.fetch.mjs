/**
 * @file: telemetry.fetch.mjs
 * @description:Node 18+ 原生 支持fetch
 * @author: King Monkey
 * @created: 2025-07-31 11:24
 */
import { createHash } from 'node:crypto'
import os from 'node:os'

import { getLang } from './langDetect.mjs'

const TELEMETRY_ENDPOINT = 'https://api.hisread.com/api/track/wukong'

const getAnonymousId = () => {
  const raw = `${os.hostname()}|${os.arch()}`
  const hash = createHash('sha256').update(raw).digest('hex')
  return hash.slice(0, 12)
}

/**
 * 发送匿名打点
 * @param {string} eventType 事件名称，如 'install', 'deploy'
 * @param {object} extraData 额外字段，随事件发送
 */
export const sendTelemetry = async (eventType, extraData = {}) => {
  if (process.env.WUKONG_NO_TELEMETRY === '1') return

  const lang = getLang()
  const payload = {
    event: eventType,
    time: new Date().toISOString(),
    version: process.env.npm_package_version || 'unknown',
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    lang,
    cli: 'wukong-deploy',
    id: getAnonymousId(),
    ...extraData
  }

  try {
    await fetch(TELEMETRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch {
    // 静默失败，不影响主流程
  }
}
