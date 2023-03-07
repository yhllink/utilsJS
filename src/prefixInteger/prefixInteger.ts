/**
 * 向字符串前面补位0
 * @param {String} str // 需要补位的数据
 * @param {Number} length // 补位长度
 * @returns {String}
 */
export default function prefixInteger(str: string | number, length: number): string {
  return String(str).padStart(length, '0')
}
