import path from 'node:path'

const rootDir = process.cwd()
const configFile = path.resolve(rootDir, 'config/config.mjs')

export async function getServerList() {
  const config = await import(configFile)
  const { servers } = config.default

  const serverList = Object.entries(servers).map(([key, value]) => ({
    key, // 'test'、'dev'、'prod'
    ...value // name, host, ...
  }))

  return serverList || []
}
