import encodeURIZnCh from '../encodeURIZnCh/encodeURIZnCh'

/**
 * 将字符串转换为base64编码
 * @param {string} str - 要编码的字符串
 * @returns {string} - base64编码后的字符串
 */
function btoa(str: string) {
  if (typeof window !== 'undefined') {
    return window.btoa(encodeURIZnCh(str))
  } else {
    return Buffer.from(str).toString('base64')
  }
}

/**
 * 将base64编码的字符串转换为普通字符串
 * @param {string} str - 要解码的base64字符串
 * @returns {string} - 解码后的普通字符串
 */
function atob(str: string) {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(window.atob(str))
  } else {
    return Buffer.from(str, 'base64').toString('utf-8')
  }
}

const Base64 = { btoa, atob }
export default Base64
