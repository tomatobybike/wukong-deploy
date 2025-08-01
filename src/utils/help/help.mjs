/**
 * @file: \src\utils\help\help.mjs
 * @description:
 * @author: King Monkey
 * @created: 2025-08-01 17:04
 */
import {locales} from '../../locales/index.mjs'
import { printExample, printHelp } from './helpPrinter.mjs'

export function showHelp({ lang = 'en', version }) {
  const t = locales[lang]

  printHelp({
    ...t,
    version,
    lang
  })
}

export async function showExample({ lang = 'en' }) {
  const t = locales[lang]
  const examples = t.examples || []

  await printExample({ examples, lang })
}
