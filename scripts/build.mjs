// scripts/build.mjs
import { build } from 'esbuild'
import fs from 'fs-extra'

await build({
  entryPoints: ['./bin/cli.mjs'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: './dist/cli.mjs',
  external: [
    'node:*',
    'chalk',
    'date-fns',
    'dotenv',
    'fs-extra',
    'inquirer',
    'node-ssh',
    'ora',
    'strip-ansi'
  ],
  // 不打包内置模块
  // 源代码顶部已有 #!/usr/bin/env node
  // banner: {
  //   js: '#!/usr/bin/env node'
  // },
  format: 'esm',
  minify: false,
  sourcemap: false,
  logLevel: 'info'
})

// 复制 locales
await fs.copy('./src/locales', './dist/locales')

console.log('✅ Build finished')
