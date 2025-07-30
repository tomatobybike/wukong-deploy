// src/utils/telemetry.mjs
import os from 'node:os'
import { createHash } from 'node:crypto'
import fetch from 'node-fetch'

const TELEMETRY_ENDPOINT = 'https://your-server.com/api/track' // 请改成你自己的接口地址

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

  const payload = {
    event: eventType,
    time: new Date().toISOString(),
    version: process.env.npm_package_version || 'unknown',
    platform: process.platform,
    arch: process.arch,
    node: process.version,
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
