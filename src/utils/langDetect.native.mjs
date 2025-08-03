// langDetect.mjs

// 从环境变量中检测语言
export function detectLangFromEnv() {
  const envLang =
    process.env.WUKONG_LANG ||  // 用户显式指定
    process.env.LANG ||         // 系统默认
    process.env.LC_ALL ||
    process.env.LANGUAGE ||
    ''

  return /^zh/i.test(envLang) ? 'zh' : 'en'
}

// 从命令行参数中解析语言，例如 --lang=zh
export function parseLangArg() {
  const langArg = process.argv.find((arg) => arg.startsWith('--lang='))
  if (langArg) {
    const lang = langArg.split('=')[1]?.toLowerCase()
    if (['zh', 'en'].includes(lang)) {
      return lang
    }
  }
  return null
}

// 最终语言获取函数：优先参数，其次环境变量
export function getLang() {
  return parseLangArg() || detectLangFromEnv()
}

// 是否中文
export function isZh() {
  return getLang() === 'zh'
}
