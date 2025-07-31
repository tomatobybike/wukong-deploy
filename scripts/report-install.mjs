// scripts/report-install.mjs
import { sendTelemetry } from '../src/utils/telemetry.fetch.mjs'

async function main() {
  await sendTelemetry('install')
}

main().catch((e) => {
  // 报错也静默，防止安装失败
})
