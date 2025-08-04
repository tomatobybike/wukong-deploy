/* eslint-disable no-template-curly-in-string */
import { getLang } from './langDetect.mjs'
import logger from './logger.mjs'
import messages from '../locales/messages.mjs'

const logCache = { write: true }

function getNestedMessage(obj, path) {
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj)
}

function formatTemplate(template, vars = {}) {
  return template.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}

function resolveMessage(key, args) {
  const lang = getLang()
  const msgObj = messages[lang] || messages.en
  let msg = getNestedMessage(msgObj, key)

  // 如果是函数：支持 args 是数组或对象
  if (typeof msg === 'function') {
    if (Array.isArray(args)) {
      msg = msg(...args)
    } else if (typeof args === 'object') {
      msg = msg(...Object.values(args))
    }
  } else if (typeof msg === 'string') {
    if (typeof args === 'object') {
      msg = formatTemplate(msg, args)
    }
  }

  return msg || key
}

export function i18nInfo(key, args) {
  logger.info(resolveMessage(key, args), logCache)
}
export function i18nSuccess(key, args) {
  logger.success(resolveMessage(key, args), logCache)
}
export function i18nWarn(key, args) {
  logger.warn(resolveMessage(key, args), logCache)
}
export function i18nError(key, args = {}) {
  logger.error(resolveMessage(key, args), logCache)
}
export function i18nGetRaw(key, args = {}) {
  return resolveMessage(key, args)
}
export function i18nLogNative(key, args = {}) {
  console.log(resolveMessage(key, args))
}
