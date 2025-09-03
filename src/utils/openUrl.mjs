import { spawn } from 'child_process'
import os from 'os'

export async function openUrl(url) {
  let cmd; let args
  if (os.platform() === 'win32') {
    cmd = 'cmd'
    args = ['/c', 'start', '', url]
  } else if (os.platform() === 'darwin') {
    cmd = 'open'
    args = [url]
  } else {
    cmd = 'xdg-open'
    args = [url]
  }

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'ignore' })
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`打开失败: ${url}`))
    )
    child.on('error', reject)
  })
}
