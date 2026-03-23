/**
 * 将 url 中的中文转义为 url 编码
 * @param {string} url 转义前的 url
 * @returns {string} 转义后的 URL
 * 
 * @example
 * // 基本用法
 * const url = 'https://example.com/搜索？查询=测试'
 * const encoded = encodeURIZnCh(url)
 * console.log(encoded) // 'https://example.com/%E6%90%9C%E7%B4%A2%EF%BC%9F%E6%9F%A5%E8%AF%A2=%E6%B5%8B%E8%AF%95'
 * 
 * @example
 * // 无中文字符
 * const url = 'https://example.com/search'
 * const encoded = encodeURIZnCh(url)
 * console.log(encoded) // 'https://example.com/search'
 */
export function encodeURIZnCh(url: string): string {
  // 使用单次正则替换，一次性处理所有中文字符
  return url.replace(
    /[\u4e00-\u9fa5\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]+/g,
    (match) => encodeURIComponent(match)
  )
}
