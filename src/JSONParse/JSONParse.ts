import type { parse as LossLessParse } from '@/vendors/lossless-json'

// 导入加载模块的函数
import { loadModules } from '@/loadModules/loadModules'

// 定义一个全局的解析函数变量
let parse: typeof LossLessParse

/**
 * 解析 json字符串 （解决大整数和小数精度丢失问题）
 * @param {string} str json字符串
 * @returns {Promise<any>} json解出来的数据
 */
export const JSONParse = (function () {
  // 判断浏览器是否支持源代码解析函数的标志
  let hasSource = false

  // 尝试运行一段代码来检测浏览器是否支持源代码解析函数
  try {
    JSON.parse('{"a": 1}', function () {
      hasSource = arguments.length === 3
    })
  } catch (error) {}

  // 对于支持源代码解析函数的浏览器使用的解析方法
  function JSONParse_has(str: string) {
    // @ts-ignore
    return JSON.parse(str, function (_key, value, { source }) {
      return typeof value === 'number' ? source : value
    })
  }
  JSONParse_has.init = function () {
    return true
  }

  // 对于不支持源代码解析函数的浏览器使用的解析方法
  function JSONParse_noHas(str: string) {
    if (parse) {
      return parse(str, (_key: string, value: any) => {
        if (value && typeof value === 'object' && value.hasOwnProperty('isLosslessNumber') && value.hasOwnProperty('value')) {
          return value.value
        }
        return typeof value === 'number' ? String(value) : value
      })
    }

    return JSON.parse(str)
  }
  JSONParse_noHas.init = async function () {
    try {
      const res = await loadModules<typeof LossLessParse>(() => import('@/vendors/lossless-json'), { modules: 'parse' })
      parse = res
      return true
    } catch (error) {}

    return false
  }

  // 根据浏览器是否支持源代码解析函数，返回对应的解析方法
  return hasSource ? JSONParse_has : JSONParse_noHas
})()
