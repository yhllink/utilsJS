/**
 * 向字符串前面补位0
 * @param {String} str // 需要补位的数据
 * @param {Number} length // 补位长度
 * @returns {String}
 */
export default function prefixInteger(str: string | number, length: number): string {
  // 使用padStart方法将字符串或数字前置补位到指定长度，使用'0'进行补位
  return String(str).padStart(length, '0')
}
