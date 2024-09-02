/**
 * 处理url中的路径问题 （添加前缀）
 *
 * 该函数主要用于处理url路径，如果给定的url不以协议头（如http://或https://）或双斜线（//）开头，
 * 则会自动为其添加双斜线（//）前缀，以形成一个相对路径。
 *
 * @param {string} url 待处理的url
 * @return {string} 处理后的url，如果输入为空或以协议头或双斜线开头，则原样返回，否则添加双斜线前缀
 */
export function handleUrl(url: string): string {
  // 如果url为空，则直接返回空字符串
  if (!url) return ''

  // 检查url是否以http://或https://或//开头，如果是，则不需要添加前缀，直接返回
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0) {
    return url
  }

  // 对于不以协议头或双斜线开头的url，添加双斜线前缀，以形成一个相对路径
  return '//' + url
}
