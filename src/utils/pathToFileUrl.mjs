// 辅助函数：将路径转换为ESM兼容的URL格式
// 解决Windows下绝对路径必须是有效file:// URL的问题
export const pathToFileUrl = (filePath) => {
  if (process.platform === 'win32') {
    // Windows路径处理：转换反斜杠，处理驱动器号
    return `file://${filePath.replace(/\\/g, '/').replace(/^([a-zA-Z]):\\/, '/$1:/')}`
  }
  // 非Windows系统
  return `file://${filePath}`
}
