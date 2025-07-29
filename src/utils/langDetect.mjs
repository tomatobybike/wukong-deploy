// langDetect.mjs
export function detectLangFromEnv() {
  const envLang =
    process.env.LANG || process.env.LC_ALL || process.env.LANGUAGE || ''

  if (/^zh/i.test(envLang)) {
    return 'zh'
  }
  return 'en'
}

export function parseLangArg() {
  const langArg = process.argv.find((arg) => arg.startsWith('--lang='))
  if (langArg) {
    const lang = langArg.split('=')[1].toLowerCase()
    if (lang === 'zh' || lang === 'en') {
      return lang
    }
  }
  return null
}

export function getLang() {
  const argLang = parseLangArg()
  if (argLang) {
    return argLang
  }
  return detectLangFromEnv()
}
