// scripts/esbuild.config.mjs
import { build } from 'esbuild'
import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))

const outdir = path.resolve(__dirname, '../bin')

await build({
  entryPoints: ['./src/index.mjs'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: path.join(outdir, 'wukong-deploy.cjs'),
  banner: {
    js: '#!/usr/bin/env node'
  },
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  },
  external: ['./config/config.mjs'],
  minify: true
})

console.log('✅ Build finished')

// 复制 locales 到 bin/locales
const localesSrc = path.resolve(__dirname, '../locales')
const localesDest = path.join(outdir, 'locales')

try {
  await fse.copy(localesSrc, localesDest)
  console.log('✅ locales 已复制到打包目录')
} catch (err) {
  console.error('❌ 复制 locales 失败:', err)
}
