// 导入用于编码 URI 组件的函数
import { encodeURIZnCh } from '@/encodeURIZnCh/encodeURIZnCh'
import { isServer } from '@/isServer/isServer'

/**
 * 将字符串编码为 Base64 格式
 * @param {string} str 需要编码的字符串
 * @returns {string} 编码后的 Base64 字符串
 */
function btoa(str: string) {
  // 使用 encodeURIZnCh 函数对字符串进行预处理
  const newStr = encodeURIZnCh(str)

  // 如果 Buffer 类型存在，则使用 Node.js 的 Buffer 类将字符串转换为 Base64 格式
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(newStr).toString('base64')
  }

  // 如果在浏览器环境中且 window 对象的 btoa 方法存在，则使用 window.btoa 进行 Base64 编码
  if (!isServer && typeof window.btoa !== 'undefined') {
    return window.btoa(newStr)
  }
}

/**
 * 将 Base64 格式字符串解码为普通字符串
 * @param {string} str 需要解码的 Base64 字符串
 * @returns {string} 解码后的普通字符串
 */
function atob(str: string) {
  // 如果 Buffer 类型存在，则使用 Node.js 的 Buffer 类将 Base64 字符串转换为普通字符串
  if (typeof Buffer !== 'undefined') {
    return decodeURIComponent(Buffer.from(str, 'base64').toString('utf-8'))
  }

  // 如果在浏览器环境中且 window 对象的 atob 方法存在，则使用 window.atob 进行 Base64 解码
  if (!isServer && typeof window.atob !== 'undefined') {
    return decodeURIComponent(window.atob(str))
  }
}

// 将 btoa 和 atob 函数作为对象导出，以便在其他模块中使用
export const Base64 = { btoa, atob }
