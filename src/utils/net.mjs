// src/utils/net.mjs
import { request } from 'node:https'
import { URL } from 'node:url'

/**
 * 发送 POST 请求（JSON 格式，带超时保护）
 * @param {string} urlStr 完整 URL
 * @param {object} data 要发送的 JSON 数据
 * @param {number} timeoutMs 超时时间（默认 1000ms）
 * @returns {Promise<void>}
 */
export const postJson = async (urlStr, data, timeoutMs = 1000) => {
  const url = new URL(urlStr)
  const payload = JSON.stringify(data)

  const options = {
    method: 'POST',
    hostname: url.hostname,
    path: url.pathname + url.search,
    port: url.port || 443,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    },
    timeout: timeoutMs
  }

  return new Promise((resolve) => {
    const req = request(options, res => {
      res.on('data', () => {}) // 忽略响应内容
      res.on('end', resolve)
    })

    req.on('error', () => resolve()) // 网络错误静默失败
    req.on('timeout', () => {
      req.destroy() // 主动销毁请求
      resolve()
    })

    req.write(payload)
    req.end()
  })
}
