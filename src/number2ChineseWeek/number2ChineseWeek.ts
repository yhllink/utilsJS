import number2Chinese from '../number2Chinese/number2Chinese'

/**
 * 将数字转换为对应的中文星期
 * 当输入的数字为7的倍数时，返回自定义的星期日字符串，否则返回对应的中文星期数
 *
 * @param week - 输入的数字，用于确定星期几
 * @param sundayStr - 星期日的自定义字符串，默认为'天'
 * @returns 返回中文星期或自定义的星期日字符串
 */
export default function number2ChineseWeek(week: number, sundayStr = '天') {
  // 计算输入数字除以7的余数，用于确定星期几
  const weekNum = week % 7
  // 当余数为0时，表示是星期日，返回自定义的星期日字符串，否则返回对应的中文星期数
  return weekNum === 0 ? sundayStr : number2Chinese(weekNum)
}
