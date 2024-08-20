/**
 * 格式化数字，保留指定位数的小数
 *
 * 该函数接受一个数值（可以是字符串或数字类型），并将其格式化为指定位数的小数
 * 如果传入的值不是有效的数字，则原样返回该值
 *
 * @param value 待格式化的数值，可以是字符串或数字类型
 * @param decimalPlaces 保留的小数位数，默认为2
 * @returns 格式化后的数值字符串，如果输入值无效则原样返回
 */
export default function formatNumber(value: string | number, decimalPlaces: number = 2) {
  // 将输入值转换为浮点数，以便后续处理
  const numValue = parseFloat(String(value))
  // 检查转换后的值是否为有效的数字，如果不是则返回原始值
  if (typeof numValue !== 'number' || isNaN(numValue)) return value

  // 使用toLocaleString方法格式化数字，确保小数位数符合要求
  return numValue.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
}
