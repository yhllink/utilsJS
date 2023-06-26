import encodeURIZnCh from '../encodeURIZnCh/encodeURIZnCh'

/**
 * 将字符串转换为base64编码
 * @param {string} str - 要编码的字符串
 * @returns {string} - base64编码后的字符串
 */
function btoa(str: string) {
  const newStr = encodeURIZnCh(str)

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(newStr).toString('base64')
  }

  if (typeof window !== 'undefined' && typeof window.btoa !== 'undefined') {
    return window.btoa(newStr)
  }
}

/**
 * 将base64编码的字符串转换为普通字符串
 * @param {string} str - 要解码的base64字符串
 * @returns {string} - 解码后的普通字符串
 */
function atob(str: string) {
  if (typeof Buffer !== 'undefined') {
    return decodeURIComponent(Buffer.from(str, 'base64').toString('utf-8'))
  }

  if (typeof window !== 'undefined' && typeof window.atob !== 'undefined') {
    return decodeURIComponent(window.atob(str))
  }
}

const Base64 = { btoa, atob }
export default Base64
