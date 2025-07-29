import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { printHelp } from './printHelp.mjs'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function loadHelp(lang = 'en') {
  const filePath = path.resolve(__dirname, '../locales', `help.${lang}.json`)
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    console.error(`加载帮助文件失败: ${filePath}`, err)
    process.exit(1)
  }
}

export async function showHelp(lang = 'en') {

  const helpData = await loadHelp(lang)

  await printHelp({
    ...helpData,
    lang,
    cliName: 'wukong-deploy' // 可以改成动态
  })
}
