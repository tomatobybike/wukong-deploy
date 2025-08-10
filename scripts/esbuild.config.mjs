// scripts/esbuild.config.mjs
import { exec } from 'child_process'
import { build } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import zlib from 'zlib'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
)

const outdir = path.resolve(__dirname, '../bin')
if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true })

// CLI 参数
const args = process.argv.slice(2)
const analyzeMode = args.includes('--analyze')
let chartType = 'treemap'
const chartIndex = args.indexOf('--chart')
if (chartIndex !== -1 && args[chartIndex + 1]) chartType = args[chartIndex + 1]

let compressMode = 'gzip' // treemap 使用的默认压缩类型
const compIndex = args.indexOf('--compress')
if (compIndex !== -1 && args[compIndex + 1]) compressMode = args[compIndex + 1]

// 校验 chart & compress 参数
const allowedCharts = ['treemap', 'sunburst', 'network']
if (!allowedCharts.includes(chartType)) {
  console.warn(`⚠️ Unknown chart type "${chartType}", fallback to "treemap"`)
  chartType = 'treemap'
}
const allowedCompress = ['raw', 'gzip', 'brotli']
if (!allowedCompress.includes(compressMode)) {
  console.warn(`⚠️ Unknown compress mode "${compressMode}", fallback to "gzip"`)
  compressMode = 'gzip'
}

// 时间戳 YYYYMMDD-HHMMSS
const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0]

console.log(
  `🚀 Start build ${analyzeMode ? `(analyze mode: ${chartType}, compress: ${compressMode})` : ''} ...`
)

const outfilePath = path.join(outdir, 'wukong-deploy.cjs')

const result = await build({
  entryPoints: ['./src/index.mjs'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: outfilePath,
  banner: { js: `#!/usr/bin/env node\n\n` },
  define: {
    // 这里用相对路径写死，确保运行时不会报错
    // 入口脚本路径的绝对路径，转成 file:// 协议格式
    'import.meta.url': JSON.stringify(
      `file://${outfilePath.replace(/\\/g, '/')}`
    ),
    __VERSION__: JSON.stringify(pkg.version),
    __PKG_NAME__: JSON.stringify(pkg.name)
  },
  external: ['./config/config.mjs', '*.node'],
  minify: true,
  metafile: analyzeMode // 只有分析模式才生成 metafile
})

console.log('✅ Build finished')

if (!analyzeMode) {
  console.log('ℹ️ Analyze mode not enabled. Done.')
  process.exit(0)
}

// --- 分析模式后续处理 ---
const metaFilePath = path.join(outdir, `meta-${timestamp}.json`)
fs.writeFileSync(metaFilePath, JSON.stringify(result.metafile, null, 2))
console.log(`📊 metafile saved: ${metaFilePath}`)

// 读取打包产物并计算总 raw/gzip/brotli
let bundleRaw = 0
let bundleGzip = 0
let bundleBrotli = 0
try {
  const buf = fs.readFileSync(outfilePath)
  bundleRaw = buf.length
  bundleGzip = zlib.gzipSync(buf).length
  bundleBrotli = zlib.brotliCompressSync(buf).length
} catch (e) {
  console.warn('⚠️ 无法读取 bundle 文件进行压缩统计:', e.message)
}

// --- 为每个 input 计算 raw/gzip/brotli，并把压缩后的值写回 metafile outputs.inputs[].bytes ---
// 说明：esbuild 的 metafile 包含 top-level `inputs` 和 `outputs`。
// 我们尝试读取每个 metafile.inputs 的源文件，计算压缩大小。
// 然后在 outputs[*].inputs[*].bytes 中替换成所需的值（raw/gzip/brotli），
// 并输出一个新的 meta-compressed-*.json 给 visualizer 使用。

const { metafile } = result
const inputStats = {} // { inputPath: { raw, gzip, brotli } }

const readPossibleFile = (p) => {
  // 尝试多种可能路径：原样、相对于 cwd、相对于脚本目录
  if (fs.existsSync(p)) return fs.readFileSync(p)
  const alt = path.resolve(process.cwd(), p)
  if (fs.existsSync(alt)) return fs.readFileSync(alt)
  const alt2 = path.resolve(__dirname, '..', p)
  if (fs.existsSync(alt2)) return fs.readFileSync(alt2)
  return null
}

const getSizes = (buf) => {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf)
  return {
    raw: b.length,
    gzip: zlib.gzipSync(b).length,
    brotli: zlib.brotliCompressSync(b).length
  }
}

// 处理 metafile.inputs（可能包含很多外部或内置模块）
if (metafile.inputs && typeof metafile.inputs === 'object') {
  for (const inputPath of Object.keys(metafile.inputs)) {
    try {
      const content = readPossibleFile(inputPath)
      if (content) {
        inputStats[inputPath] = getSizes(content)
      } else {
        // 没有找到源文件，使用 esbuild 提供的 bytes（如果存在）
        const metaInput = metafile.inputs[inputPath]
        if (metaInput && typeof metaInput.bytes === 'number') {
          const raw = metaInput.bytes
          // 无法准确 gzip/brotli 估算原始 bytes 的压缩值，设为 raw（降级）
          inputStats[inputPath] = { raw, gzip: raw, brotli: raw }
        } else {
          // 最后退回 0
          inputStats[inputPath] = { raw: 0, gzip: 0, brotli: 0 }
        }
      }
    } catch (e) {
      console.warn(`⚠️ 读取或压缩 ${inputPath} 失败: ${e.message}`)
      inputStats[inputPath] = { raw: 0, gzip: 0, brotli: 0 }
    }
  }
} else {
  console.warn('⚠️ metafile.inputs 不存在或格式异常，无法按模块计算压缩大小')
}

// 制作一个新的 metafile 拷贝并替换 outputs[*].inputs[*].bytes
const compressedMeta = JSON.parse(JSON.stringify(metafile))

if (compressedMeta.outputs && typeof compressedMeta.outputs === 'object') {
  for (const [outPath, outData] of Object.entries(compressedMeta.outputs)) {
    // 先判断 outData.inputs 是否存在且是对象
    if (outData.inputs && typeof outData.inputs === 'object') {
      for (const inputKey of Object.keys(outData.inputs)) {
        // inputKey 对应 metafile.inputs 的键（通常是绝对或相对路径）
        const stats = inputStats[inputKey]
        if (stats) {
          let chosen = stats.gzip
          if (compressMode === 'raw') chosen = stats.raw
          else if (compressMode === 'brotli') chosen = stats.brotli
          // 把 outputs[].inputs[].bytes 替换为压缩后大小
          compressedMeta.outputs[outPath].inputs[inputKey].bytes = chosen
        } else {
          // 如果没有统计信息，保持原 bytes（如果有）
          // 不做改动
        }
      }
      // 可选：把 outputs[].bytes 也替换为 outputs inputs bytes 的和（更符合可视化）
      try {
        const sum = Object.values(
          compressedMeta.outputs[outPath].inputs
        ).reduce((acc, v) => acc + (v && v.bytes ? v.bytes : 0), 0)
        if (sum > 0) compressedMeta.outputs[outPath].bytes = sum
      } catch (e) {
        // ignore
      }
    }
    // 如果 outData.inputs 不存在或类型不是对象，就不做任何操作，继续下一个循环
  }
} else {
  console.warn(
    '⚠️ metafile.outputs 不存在或格式异常，无法替换 outputs.inputs bytes'
  )
}

// 写出新的压缩版 metafile
const compressedMetaPath = path.join(
  outdir,
  `meta-compressed-${timestamp}.json`
)
fs.writeFileSync(compressedMetaPath, JSON.stringify(compressedMeta, null, 2))
console.log(`🗂 compressed metafile saved: ${compressedMetaPath}`)

// 生成 html 报告（由 esbuild-visualizer 生成）
const htmlReportPath = path.join(outdir, `bundle-report-${timestamp}.html`)
const cmd = `npx esbuild-visualizer --metadata ${compressedMetaPath} --template ${chartType} --filename ${htmlReportPath}`

exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error('❌ 生成分析报告失败:', err)
    console.error(stderr)
    return
  }

  // 插入顶部打包信息（包括总 raw/gzip/brotli）
  try {
    let html = fs.readFileSync(htmlReportPath, 'utf8')
    const formatSize = (n) => `${(n / 1024).toFixed(2)} KB`
    const buildInfoHtml = `
      <div style="padding:10px;background:#f6f8fa;border-bottom:1px solid #e6e6e6;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,monospace;font-size:13px;">
        📦 <b>Package:</b> ${pkg.name}@${pkg.version} &nbsp; | &nbsp;
        🕒 <b>Build Time:</b> ${new Date().toLocaleString()} &nbsp; | &nbsp;
        🖥 <b>Node:</b> ${process.version} &nbsp; | &nbsp;
        📊 <b>Chart:</b> ${chartType} &nbsp; | &nbsp;
        🔢 <b>Treemap uses:</b> ${compressMode} &nbsp; | &nbsp;
        📐 <b>Bundle Size:</b> ${formatSize(bundleRaw)} (raw) , ${formatSize(bundleGzip)} (gzip) , ${formatSize(bundleBrotli)} (brotli)
      </div>
    `
    html = html.replace('<body>', `<body>\n${buildInfoHtml}`)
    fs.writeFileSync(htmlReportPath, html, 'utf8')
    console.log('📝 已在报告中插入打包信息与压缩统计')
  } catch (e) {
    console.warn('⚠️ 插入打包信息到 HTML 失败:', e.message)
  }

  console.log(`✅ 分析报告已生成: ${htmlReportPath}`)

  // 自动打开浏览器
  if (process.platform === 'win32') exec(`start "" "${htmlReportPath}"`)
  else if (process.platform === 'darwin') exec(`open "${htmlReportPath}"`)
  else exec(`xdg-open "${htmlReportPath}"`)
})

/*
或者直接把打包输出的meta.json 上传https://esbuild.github.io/analyze/ 页面，会自动分析
*/
