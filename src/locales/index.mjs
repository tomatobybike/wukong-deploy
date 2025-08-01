import path from 'path'
import fs from 'fs'

const __dirname = path.resolve()

const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/help.en.json'), 'utf-8'))
const zh = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/locales/help.zh.json'), 'utf-8'))

export const locales = { zh, en }
