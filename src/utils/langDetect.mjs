// langDetect.mjs

/**
 * 归一化语言，只识别 zh 和 en，默认 en
 */
function normalizeLang(input = '') {
  if (/^zh/i.test(input)) return 'zh'
  if (/^en/i.test(input)) return 'en'
  return 'en'
}

/**
 * 从命令行参数解析语言，如 --lang=zh
 */
export function parseLangArg() {
  const langArg = process.argv.find((arg) => arg.startsWith('--lang='))
  if (langArg) {
    const lang = langArg.split('=')[1]
    return normalizeLang(lang)
  }
  return null
}

/**
 * 从环境变量中检测语言
 */
export function detectLangFromEnv() {
  const envLang =
    process.env.WUKONG_LANG ||
    process.env.LC_ALL ||
    process.env.LANGUAGE ||
    process.env.LANG ||
    ''
  return normalizeLang(envLang)
}

/**
 * 最终语言获取函数：优先级为 命令行 > 环境变量
 */
export function getLang() {
  return parseLangArg() || detectLangFromEnv()
}

/**
 * 是否为中文
 */
export function isZh() {
  return getLang() === 'zh'
}
