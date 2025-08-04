/* eslint-disable camelcase */
// src/commands/doctor.mjs
import child_process from 'child_process'
import os from 'os'
import path from 'path'
import process from 'process'

import { colors } from './colors.mjs'

function getShell() {
  return process.env.SHELL || process.env.ComSpec || 'Unknown'
}

function getNpmGlobalRoot() {
  try {
    return child_process.execSync('npm root -g').toString().trim()
  } catch {
    return 'Unknown'
  }
}

function getGlobalBinPath() {
  try {
    return child_process.execSync('npm bin -g').toString().trim()
  } catch {
    return 'Unknown'
  }
}

function getInstallDir() {
  return path.dirname(process.argv[1] || '')
}

function getGitVersion() {
  try {
    return child_process.execSync('git --version').toString().trim()
  } catch {
    return 'Git not found'
  }
}

export function doctor() {
  console.log(colors.boldBlue('\n🧪  wukong-deploy Doctor Report'))
  console.log(colors.gray('----------------------------------------'))
  console.log(`${colors.bold('Version')}: VERSION`)
  console.log(`${colors.bold('Node.js')}: ${process.version}`)
  console.log(
    `${colors.bold('Platform')}: ${os.platform()} ${os.release()} (${os.arch()})`
  )
  console.log(`${colors.bold('Shell')}: ${getShell()}`)
  console.log(`${colors.bold('Git')}: ${getGitVersion()}`)
  console.log(`${colors.bold('Install Dir')}: ${getInstallDir()}`)
  console.log(`${colors.bold('Global npm root')}: ${getNpmGlobalRoot()}`)
  console.log(`${colors.bold('Global npm bin')}: ${getGlobalBinPath()}`)
  console.log(`${colors.bold('CWD')}: ${process.cwd()}`)
  console.log(colors.gray('----------------------------------------\n'))
}
