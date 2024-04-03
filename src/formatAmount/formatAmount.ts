/**
 * 格式化金额
 * @param {string | number} value 金额
 * @param {number} decimalPlaces 小数位数
 * @returns {string} 格式化后的金额
 */
const formatAmount = function (value: string | number, decimalPlaces: number = 2) {
  const numValue = parseFloat(String(value))
  if (typeof numValue !== 'number' || isNaN(numValue)) return value

  const formattedValue = numValue.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
  return formattedValue
}
export default formatAmount
