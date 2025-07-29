import { c } from './colors.mjs'

export function printAuthorInfo({ lang = 'en', version }) {
  const data = {
    zh: {
      title: `wukong-deploy 信息`,
      desc: '一个部署工具，用于快速部署项目到远程服务器。',
      items: {
        版本: version,
        作者: '杨琼',
        邮箱: 'tomatojacky@126.com',
        GitHub: 'https://www.npmjs.com/package/wukong-deploy',
        许可证: 'MIT'
      }
    },
    en: {
      title: `wukong-deploy Info`,
      desc: 'A deployment tool for quickly pushing projects to remote servers.',
      items: {
        Version: version,
        Author: 'Yang Qiong',
        Email: 'tomatojacky@126.com',
        GitHub: 'https://github.com/yourname/wukong-deploy',
        License: 'MIT'
      }
    }
  }

  const { title, desc, items } = data[lang] || data.en

  console.log(`\n${c.title(title)}\n`)
  console.log(c.dim(desc))

  for (const [label, value] of Object.entries(items)) {
    const isLink = typeof value === 'string' && value.startsWith('http')
    console.log(
      `${c.label(`${label}:`)} ${isLink ? c.link(value) : c.value(value)}`
    )
  }

  console.log()
}
