import archiver from 'archiver'
import { format } from 'date-fns'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'

import logger from './logger.mjs'

/**
 * Cross-platform local directory compression to zip
 * Uses archiver (pure JS) for Windows/macOS/Linux compatibility
 * @param {string} sourceDir - local directory path to compress
 * @param {string} destZip   - output zip file path
 * @returns {Promise<string>} the zip file path
 */
export async function zipLocal(sourceDir, destZip) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destZip)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      const stats = fs.statSync(destZip)
      logger.debug(`Compressed ${sourceDir} → ${destZip} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
      resolve(destZip)
    })

    archive.on('error', (err) => {
      reject(new Error(`Compression failed: ${err.message}`))
    })

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}

/**
 * Ensure the remote server has unzip installed
 * Tries apt-get first, then yum as fallback
 * @param {object} ssh - node-ssh instance
 * @returns {Promise<void>}
 */
export async function ensureUnzipOnServer(ssh) {
  const checkCmd = 'which unzip 2>/dev/null && echo "FOUND" || echo "NOT_FOUND"'
  const checkResult = await ssh.execCommand(checkCmd)

  if (checkResult.stdout.includes('NOT_FOUND')) {
    logger.debug('unzip not found on server, attempting installation...')

    // Try apt-get first (Debian/Ubuntu), then yum (CentOS/RHEL)
    const installResult = await ssh.execCommand(
      'apt-get update -qq && apt-get install -y -qq zip unzip 2>/dev/null || yum install -y -q zip unzip 2>/dev/null'
    )

    if (installResult.code !== 0 && installResult.stderr) {
      throw new Error(`Failed to install unzip on server: ${installResult.stderr}`)
    }
  }
}

/**
 * Back up the remote directory before overwriting
 * Creates a tar.gz (default) or zip archive with timestamp in the same parent directory
 * @param {object} ssh         - node-ssh instance
 * @param {string} remotePath  - remote directory path to back up
 * @param {string} [backupFormat='tar'] - backup format: 'tar' (tar.gz) or 'zip'
 * @returns {Promise<{backupPath: string, backupName: string} | null>}
 */
export async function backupRemoteDir(ssh, remotePath, backupFormat = 'tar') {
  const parentDir = path.posix.dirname(remotePath)
  const dirName = path.posix.basename(remotePath)
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss')
  const useZip = backupFormat === 'zip'
  const ext = useZip ? '.zip' : '.tar.gz'
  const backupName = `${dirName}_backup_${timestamp}${ext}`
  const backupPath = path.posix.join(parentDir, backupName)

  // Check if the remote directory exists
  const checkResult = await ssh.execCommand(
    `[ -d "${remotePath}" ] && echo "EXISTS" || echo "NOT_EXISTS"`
  )

  if (checkResult.stdout.includes('NOT_EXISTS')) {
    logger.debug(`Remote directory ${remotePath} does not exist, skipping backup`)
    return null
  }

  // Create backup archive
  const backupCmd = useZip
    ? `cd "${parentDir}" && zip -rq "${backupName}" "${dirName}"`
    : `tar -czf "${backupPath}" -C "${parentDir}" "${dirName}"`
  const result = await ssh.execCommand(backupCmd)

  if (result.code !== 0 && result.stderr) {
    throw new Error(`Remote backup failed: ${result.stderr}`)
  }

  logger.debug(`Remote backup created: ${backupPath}`)
  return { backupPath, backupName }
}

/**
 * Compress → [Backup] → Upload → Extract → Cleanup pipeline
 * 1. Compress local directory to temp zip (cross-platform via archiver)
 * 2. Optionally backup existing remote directory (tar.gz or zip)
 * 3. Upload zip to server (remote parent dir) via ssh.putFile
 * 4. Run unzip -o on server to extract to target path
 * 5. Cleanup temp zip file on both local and remote
 *
 * @param {object} ssh     - node-ssh instance (must be connected)
 * @param {object} options
 * @param {string} options.local  - local directory path
 * @param {string} options.remote - remote target directory path
 * @param {boolean} [options.backup=false] - backup existing remote directory before overwrite
 * @param {string} [options.format='tar'] - backup format: 'tar' (tar.gz) or 'zip'
 * @returns {Promise<{backupName?: string} | void>}
 */
export async function uploadWithCompress(ssh, { local, remote, backup, format: backupFormat = 'tar' }) {
  // 1. Validate local path
  if (!fs.existsSync(local)) {
    throw new Error(`Local path not found: ${local}`)
  }

  if (!fs.statSync(local).isDirectory()) {
    throw new Error(`Local path is not a directory: ${local}`)
  }

  // 2. Compress local directory
  const tmpDir = os.tmpdir()
  const zipName = `.deploy-${Date.now()}.zip`
  const localZip = path.join(tmpDir, zipName)
  const remoteParentDir = path.posix.dirname(remote)
  const remoteZip = path.posix.join(remoteParentDir, zipName)

  let localZipFile
  try {
    localZipFile = await zipLocal(local, localZip)
  } catch (err) {
    throw new Error(`Local compression failed: ${err.message}`)
  }

  // 3. Ensure server-side tools for zip backup (if enabled)
  if (backup && backupFormat === 'zip') {
    await ensureUnzipOnServer(ssh)
  }

  // 4. Backup existing remote directory (if enabled)
  let backupInfo = null
  if (backup) {
    try {
      backupInfo = await backupRemoteDir(ssh, remote, backupFormat)
    } catch (err) {
      throw new Error(`Remote backup failed: ${err.message}`)
    }
  }

  // 5. Ensure server has unzip (for upload extraction)
  await ensureUnzipOnServer(ssh)

  // 6. Upload zip to server
  await ssh.putFile(localZipFile, remoteZip)

  // 7. Ensure remote target directory exists
  await ssh.execCommand(`mkdir -p ${remote}`)

  // 8. Extract on server with overwrite
  const extractResult = await ssh.execCommand(`unzip -o ${remoteZip} -d ${remote}`)

  if (extractResult.code !== 0 && extractResult.stderr) {
    throw new Error(`Remote extraction failed: ${extractResult.stderr}`)
  }

  // 9. Cleanup temp files
  await ssh.execCommand(`rm -f ${remoteZip}`)
  await fs.remove(localZipFile)

  logger.debug(`Cleaned up temp zip files: ${localZipFile}, ${remoteZip}`)

  return backupInfo || undefined
}
