
import os from 'node:os'
import { createHash } from 'node:crypto'
import { postJson } from './net.mjs'

const TELEMETRY_ENDPOINT = 'https://your-server.com/api/track'

const getAnonymousId = () => {
  const raw = `${os.hostname()}|${os.arch()}`
  const hash = createHash('sha256').update(raw).digest('hex')
  return hash.slice(0, 12)
}

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

  await postJson(TELEMETRY_ENDPOINT, payload)
}
