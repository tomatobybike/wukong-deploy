/**
 * @file: \src\utils\help\help.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-01 17:04
 */
import fs from 'fs/promises'
import path from 'path'

import { getProjectRoot } from '../getBaseDir.mjs'
import { printExample, printHelp } from './helpPrinter.mjs'



export async function loadHelp(lang = 'en') {
  const projectRoot = getProjectRoot()
  console.log('loadHelp projectRoot:', projectRoot)
  // locales 在项目根目录的 locales 文件夹中
  const filePath = path.resolve(projectRoot, 'locales', `help.${lang}.json`)
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    console.error(`加载帮助文件失败: ${filePath}`, err)
    process.exit(1)
  }
}

export async function showHelp({ lang = 'en', version }) {
  const helpData = await loadHelp(lang)

  await printHelp({
    ...helpData,
    version,
    lang
  })
}

export async function showExample({ lang = 'en' }) {
  const helpData = await loadHelp(lang)
  const examples = helpData.examples || []

  await printExample({ examples, lang })
}
