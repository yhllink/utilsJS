import * as lossJSON from 'lossless-json'

/**
 * 解析 json字符串 （解决大整数精度丢失问题）
 * @param str json字符串
 * @returns json解出来的数据
 */
const JSONParse = function (str: string): any {
  try {
    console.log(lossJSON);
    
    return lossJSON.parse(str, (i, value) => {
      if (value && typeof value === 'object' && 'isLosslessNumber,value' === Object.keys(value).join(',')) {
        // @ts-ignore
        value = value.value

        if (typeof value !== 'string') return value
        if (value.length < 16 || value.indexOf('.') > -1) return Number(value)
        return value
      }
      return value
    })
  } catch (error) {}
}
export default JSONParse
