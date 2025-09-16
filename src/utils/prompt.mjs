// utils/promptSelect.mjs
import inquirer from 'inquirer'

function isGitBash() {
  // Git Bash 特有的环境变量
  if (process.env.MSYSTEM) return true

  // 有时 SHELL 会是 .../bash.exe
  if (process.env.SHELL?.toLowerCase().includes('bash.exe')) return true

  // 在 Windows 下用 Git Bash 打开时，process.env.PATH 里通常含有 Git
  if (
    process.platform === 'win32' &&
    process.env.PATH?.toLowerCase().includes('git')
  ) {
    return true
  }

  return false
}

/**
 * 自动降级的选择器
 * @param {string} message 提示信息
 * @param {Array<{name: string, value: any}>} choices 可选项
 * @param {string} name 结果字段名
 */
export async function promptSelect(message, choices, name = 'value') {
  const isInteractive = process.stdout.isTTY && process.stdin.isTTY

  const promptType = isGitBash() ? 'rawlist' : 'list'

  if (isInteractive) {
    // 交互式终端，正常用 list
    return inquirer.prompt([
      {
        type: promptType,
        name,
        message,
        choices
      }
    ])
  }
  // 非交互式终端，降级为编号输入
  console.log(message)
  choices.forEach((c, i) => {
    if (c.type === 'separator') {
      console.log('---')
    } else {
      console.log(`${i + 1}. ${c.name}`)
    }
  })

  return inquirer.prompt([
    {
      type: 'input',
      name,
      message: '请输入编号: ',
      validate: (v) => {
        const index = Number(v)
        return index >= 1 && index <= choices.length
      },
      filter: (v) => choices[Number(v) - 1].value
    }
  ])
}

/**
 * 确认提示（始终交互）
 * @param {string} message 提示信息
 * @param {boolean} defaultValue 默认值
 * @param {string} name 字段名
 */
export async function promptConfirm(message, defaultValue = false, name = 'confirm') {
  return inquirer.prompt([
    {
      type: 'confirm',
      name,
      message,
      default: defaultValue
    }
  ])
}
