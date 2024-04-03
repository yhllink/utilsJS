/**
 * 处理url中的路径问题 （添加前缀）
 * @param {string} url 待处理的url
 * @return {string} url
 */
export default function handleUrl(url: string): string {
  if (!url) return ''

  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0) {
    return url
  }

  return '//' + url
}
