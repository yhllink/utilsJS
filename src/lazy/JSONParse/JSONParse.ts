import * as lossJSON from 'lossless-json'

/**
 * 解析 json字符串 （解决大整数精度丢失问题）
 * @param {string} str json字符串
 * @returns {any} json解出来的数据
 */
export default function JSONParse(str: string): any {
  try {
    // 使用lossless-json库解析json字符串，以保留大整数的精度
    // 当解析到的对象属性名为isLosslessNumber且值为对象时，将其转换为原始数值
    return lossJSON.parse(str, (i, value) => {
      // 检查是否为一个对象且表示无精度损失的数值
      if (value && typeof value === 'object' && 'isLosslessNumber,value' === Object.keys(value).join(',')) {
        // @ts-ignore
        value = value.value

        // 如果值不是字符串类型，则直接返回该值
        if (typeof value !== 'string') return value
        // 如果字符串长度小于16或包含小数点，则将其转换为Number类型
        if (value.length < 16 || value.indexOf('.') > -1) return Number(value)
        // 否则，返回原始字符串值
        return value
      }
      // 如果不满足上述条件，直接返回当前值
      return value
    })
  } catch (error) {}
  // 如果解析过程中发生错误，则该函数不会返回任何内容
}
