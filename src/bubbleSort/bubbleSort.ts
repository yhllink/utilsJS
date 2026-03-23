/**
 * 冒泡排序函数（原地排序，不修改原数组）
 * @param arr 待排序的数组，数组元素类型不限
 * @param getVal 可选的回调函数，用于获取每个元素的排序值，如果提供，则使用该函数比较元素
 * @returns 排序后的数组
 * 
 * @example
 * // 基本用法
 * const arr = [3, 1, 4, 1, 5]
 * const sorted = bubbleSort(arr)
 * console.log(sorted) // [1, 1, 3, 4, 5]
 * 
 * @example
 * // 使用 getVal 回调
 * const arr = [{ val: 3 }, { val: 1 }, { val: 2 }]
 * const sorted = bubbleSort(arr, (item) => item.val)
 */
export function bubbleSort(arr: any[], getVal?: (item: any) => number): any[] {
  const result = [...arr]
  const length = result.length
  
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      const compare = getVal ? getVal(result[j]) - getVal(result[j + 1]) : result[j] - result[j + 1]
      if (compare > 0) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]]
      }
    }
  }
  
  return result
}
