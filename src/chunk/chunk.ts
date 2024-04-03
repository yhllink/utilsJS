/**
 * 不改变原数组，将数组拆成指定长度的数组
 * @param {any[]} arr 要拆分的数组
 * @param {number} size 拆分的长度
 * @returns {any[][]} 拆分后的数组
 */
function chunk(arr: any[], size: number): any[][] {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
export default chunk
