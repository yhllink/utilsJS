/**
 * 获取数据的真实类型
 * @param {any} data // 数据
 * @returns {String} String|Object|Map|...
 */
export default function isType(data: any): string {
  const str: string = Object.prototype.toString.call(data)

  const mat = str.match(/^\[object\s(.*)]$/)

  if (mat) return mat[1]

  return ''
}
