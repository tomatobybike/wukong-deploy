// scripts/esbuild.config.mjs
import { build } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
)

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
  external: ['./config/config.mjs','*.node'],
  minify: true
})

console.log('✅ Build finished')
