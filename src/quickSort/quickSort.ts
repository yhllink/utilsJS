/**
 * 快速排序（原地排序，不修改原数组）
 * @param {any[]} arr 待排序的数组
 * @param getVal 获取排序字段的函数，可选
 * @returns {any[]} 排序后的数组
 * 
 * @example
 * // 基本用法
 * const arr = [3, 1, 4, 1, 5]
 * const sorted = quickSort(arr)
 * console.log(sorted) // [1, 1, 3, 4, 5]
 * 
 * @example
 * // 使用 getVal 回调
 * const arr = [{ val: 3 }, { val: 1 }, { val: 2 }]
 * const sorted = quickSort(arr, (item) => item.val)
 */
export function quickSort(arr: any[], getVal?: (item: any) => number): any[] {
  const result = [...arr]
  
  function sort(left: number, right: number) {
    if (left >= right) return
    
    const pivotIndex = partition(left, right)
    sort(left, pivotIndex - 1)
    sort(pivotIndex + 1, right)
  }
  
  function partition(left: number, right: number): number {
    const pivot = result[Math.floor((left + right) / 2)]
    let i = left
    let j = right
    
    while (i <= j) {
      const compareI = getVal ? getVal(result[i]) - getVal(pivot) : result[i] - pivot
      const compareJ = getVal ? getVal(result[j]) - getVal(pivot) : result[j] - pivot
      
      while (compareI < 0) {
        i++
      }
      while (compareJ > 0) {
        j--
      }
      
      if (i <= j) {
        [result[i], result[j]] = [result[j], result[i]]
        i++
        j--
      }
    }
    
    return i
  }
  
  sort(0, result.length - 1)
  return result
}
