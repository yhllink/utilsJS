/**
 * 处理url中的路径问题 （添加前缀）
 * @param url 待处理的url
 * @return url
 */
export default function handleUrl(url: string): string {
  if (!url) return ''

  if (
    url.indexOf('http://') === 0 ||
    url.indexOf('https://') === 0 ||
    url.indexOf('//') === 0
  ) {
    return url
  }

  return '//' + url
}
