import os from 'os'
import process from 'process'
import { colors } from './colors.mjs'


export function showVersionInfo(VERSION) {
  console.log(colors.title(`\nwukong-deploy v${VERSION}\n`))
  console.log(`${colors.bold('Node.js')}: ${process.version}`)
  console.log(`${colors.bold('Platform')}: ${os.platform()} ${os.arch()}`)
}
