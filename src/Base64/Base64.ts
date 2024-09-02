// 导入用于编码 URI 组件的函数
import encodeURIZnCh from '../encodeURIZnCh/encodeURIZnCh'

/**
 * 将字符串编码为 Base64 格式
 * @param {string} str 需要编码的字符串
 * @returns {string} 编码后的 Base64 字符串
 */
export const btoa = (function () {
  // 如果 Buffer 类型存在，则使用 Buffer 来进行 Base64 编码
  if (typeof Buffer !== 'undefined') {
    return function btoa(str: string) {
      return Buffer.from(encodeURIZnCh(str)).toString('base64')
    }
  }

  // 如果 window 对象存在且 window.btoa 函数存在，则使用 window.btoa 进行 Base64 编码
  if (typeof window !== 'undefined' && typeof window.btoa !== 'undefined') {
    return function btoa(str: string) {
      return window.btoa(encodeURIZnCh(str))
    }
  }

  // 如果以上条件都不满足，直接返回编码后的字符串
  return function btoa(str: string) {
    return encodeURIZnCh(str)
  }
})()

/**
 * 将 Base64 格式字符串解码为普通字符串
 * @param {string} str 需要解码的 Base64 字符串
 * @returns {string} 解码后的普通字符串
 */
export const atob = (function () {
  // 如果 Buffer 类型存在，则使用 Buffer 来进行 Base64 解码
  if (typeof Buffer !== 'undefined') {
    return function atob(str: string) {
      return decodeURIComponent(Buffer.from(str, 'base64').toString('utf-8'))
    }
  }

  // 如果 window 对象存在且 window.atob 函数存在，则使用 window.atob 进行 Base64 解码
  if (typeof window !== 'undefined' && typeof window.atob !== 'undefined') {
    return function atob(str: string) {
      return decodeURIComponent(window.atob(str))
    }
  }

  // 如果以上条件都不满足，直接返回输入的字符串
  return function atob(str: string) {
    return str
  }
})()

// 将 btoa 和 atob 函数作为对象导出，以便在其他模块中使用
const Base64 = { btoa, atob }
export default Base64
