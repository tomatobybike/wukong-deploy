import { c } from './colors.mjs'

export function printAuthorInfo(lang = 'en') {
  const zh = {
    title: 'wukong-deploy 信息',
    desc: '一个部署工具，用于快速部署项目到远程服务器。',
    author: '杨琼',
    Email: 'tomatojacky@126.com',
    github: 'https://www.npmjs.com/package/wukong-deploy',
    license: 'MIT'
  }

  const en = {
    title: 'wukong-deploy Info',
    desc: 'A deployment tool for quickly pushing projects to remote servers.',
    author: 'Yang Qiong',
    Email: 'tomatojacky@126.com',
    github: 'https://github.com/yourname/wukong-deploy',
    license: 'MIT'
  }

  const label = lang === 'zh'
    ? { author: '作者', github: 'GitHub', license: '许可证' }
    : { author: 'Author', github: 'GitHub', license: 'License' }

  const info = lang === 'zh' ? zh : en

  console.log(`\n${c.title(info.title)}\n`)
  console.log(c.dim(info.desc))
  console.log(`${c.label(`${label.author  }:`)} ${c.value(info.author)}`)
  console.log(`${c.label(`${label.github  }:`)} ${c.link(info.github)}`)
  console.log(`${c.label(`${label.license  }:`)} ${c.value(info.license)}\n`)
}
