// 定义数字到中文数字的映射
const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
// 定义中文数字的单位
const chineseUnits = ['', '十', '百', '千', '万', '亿']

/**
 * 将数字转换为中文数字
 * @param num 需要转换的数字
 * @returns 转换后的中文数字字符串
 */
function toChinese(num: number) {
  const numStr = num.toString()
  const len = numStr.length
  let chineseStr = ''

  for (let i = 0; i < len; i++) {
    const digit = parseInt(numStr[i])
    const unit = len - i - 1

    if (digit !== 0) {
      chineseStr += chineseNums[digit] + chineseUnits[unit]
    } else {
      // 处理连续的零，确保不会连续添加多个零
      if (chineseStr[chineseStr.length - 1] !== chineseNums[0]) {
        chineseStr += chineseNums[digit]
      }
    }
  }

  // 特殊处理一十
  if (chineseStr.startsWith('一十')) {
    chineseStr = chineseStr.substring(1)
  }

  // 处理零在最后的情况
  if (chineseStr.endsWith('零')) {
    chineseStr = chineseStr.slice(0, -1)
  }

  return chineseStr
}

/**
 * 将数字转换为中文数字，支持负数
 * @param num 需要转换的数字
 * @returns 转换后的中文数字字符串
 */
export function number2Chinese(num: number) {
  if (num < 0) {
    return '负' + toChinese(Math.abs(num))
  } else {
    return toChinese(num)
  }
}
