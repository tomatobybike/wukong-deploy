// report-install.mjs
// import os from 'node:os'
// import { createHash } from 'node:crypto'
// import fetch from 'node-fetch' // 若使用 Node 18+ 原生 fetch 可移除此依赖

// export const reportInstall = async () => {
//   if (process.env.WUKONG_NO_TELEMETRY) return

//   try {
//     const anonymizedId = createHash('sha256')
//       .update(`${os.hostname()}|${os.arch()}`)
//       .digest('hex')
//       .slice(0, 12)

//     const payload = {
//       event: 'install',
//       time: new Date().toISOString(),
//       version: process.env.npm_package_version || 'unknown',
//       platform: process.platform,
//       arch: process.arch,
//       node: process.version,
//       id: anonymizedId
//     }

//     await fetch('https://your-server.com/track', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     })
//   } catch {
//     // 网络请求失败不影响用户流程，静默处理
//   }
// }

// scripts/report-install.mjs
import { sendTelemetry } from '../src/utils/telemetry.mjs'

async function main() {
  await sendTelemetry('install')
}

main().catch((e) => {
  // 报错也静默，防止安装失败
})
