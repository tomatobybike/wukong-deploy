// scripts/esbuild.config.simple.mjs
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
    js: `#!/usr/bin/env node

`
  },
  define: {
    // 这里用相对路径写死，确保运行时不会报错
    // 入口脚本路径的绝对路径，转成 file:// 协议格式
    'import.meta.url': JSON.stringify(
      `file://${path.join(outdir, 'wukong-deploy.cjs').replace(/\\/g, '/')}`
    ),
    __VERSION__: JSON.stringify(pkg.version),
    __PKG_NAME__: JSON.stringify(pkg.name)
  },
  external: ['./config/config.mjs', '*.node'],
  minify: true
})

console.log('✅ Build finished')
