import inquirer from 'inquirer'

import { i18nLogNative } from './i18n.mjs'

/**
 * 在交互前自动停止 spinner 的 prompt 包装函数
 * @param {ora.Ora} spinner - ora 实例
 * @param {Array} questions - inquirer.prompt 的参数
 * @param {Object} options - 可选配置
 * @param {boolean} options.restartSpinner - 是否在回答后重新启动 spinner（默认 false）
 * @param {string} options.restartMessage - 如果重新启动 spinner，显示的提示信息
 * @returns {Promise<Object>} 返回 inquirer 的结果对象
 */
export async function promptWithSpinnerStop(spinner, questions, options = {}) {
  const { restartSpinner = false, restartMessage = '' } = options

  if (spinner && typeof spinner.stop === 'function') {
    spinner.stop()
  }

  try {
    const answers = await inquirer.prompt(questions)

    if (restartSpinner && typeof spinner.start === 'function') {
      spinner.start(restartMessage || 'Continuing...')
    }

    return answers
  } catch (err) {
    // 捕获 Ctrl+C / SIGINT 等
    if (err?.isTtyError || err?.name === 'ExitPromptError') {
      i18nLogNative('prompt.cancelInit')
      process.exit(0)
    }

    throw err
  }
}
