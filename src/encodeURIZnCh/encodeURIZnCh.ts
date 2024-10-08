/**
 * 将url中的中文转义为 url 编码
 * @param {string} url 转义前的url
 * @returns {string} 转义后的URL
 */
export function encodeURIZnCh(url: string): string {
  // 匹配URL中的中文字符
  const zz = url.match(
    /([\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+)/g
  )
  // 如果匹配到中文字符数组
  if (Array.isArray(zz)) {
    // 遍历中文字符数组，将每个中文字符转义为url编码
    for (let i = 0, l = zz.length; i < l; i++) {
      url = url.replace(zz[i], encodeURIComponent(zz[i]))
    }
  }
  // 返回转义后的URL
  return url
}
