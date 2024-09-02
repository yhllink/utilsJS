/**
 * 将数组分割为指定大小的子数组
 *
 * @param arr 要处理的数组
 * @param size 每个子数组的大小
 * @returns 返回一个由分割后子数组组成的二维数组
 */
export function chunk(arr: any[], size: number): any[][] {
  // 初始化一个空数组，用于存储分割后的子数组
  const result = []

  // 遍历原数组，每次以指定的大小(size)切分原数组
  for (let i = 0; i < arr.length; i += size) {
    // 将切分出的子数组添加到结果数组中
    result.push(arr.slice(i, i + size))
  }

  // 返回分割后的二维数组
  return result
}
