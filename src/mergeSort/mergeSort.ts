/**
 * 归并排序（原地排序，不修改原数组）
 * @param {any[]} arr 待排序的数组
 * @param getVal 获取排序字段的函数，可选
 * @returns {any[]} 排序后的数组
 * 
 * @example
 * // 基本用法
 * const arr = [3, 1, 4, 1, 5]
 * const sorted = mergeSort(arr)
 * console.log(sorted) // [1, 1, 3, 4, 5]
 * 
 * @example
 * // 使用 getVal 回调
 * const arr = [{ val: 3 }, { val: 1 }, { val: 2 }]
 * const sorted = mergeSort(arr, (item) => item.val)
 */
export function mergeSort(arr: any[], getVal?: (item: any) => number): any[] {
  if (arr.length <= 1) return arr
  
  const result = [...arr]
  
  function merge(left: any[], right: any[]): any[] {
    let [l, r] = [0, 0]
    const merged = []
    
    while (l < left.length && r < right.length) {
      const compare = getVal ? getVal(left[l]) - getVal(right[r]) : left[l] - right[r]
      if (compare < 0) {
        merged.push(left[l])
        l++
      } else {
        merged.push(right[r])
        r++
      }
    }
    
    return [...merged, ...left.slice(l), ...right.slice(r)]
  }
  
  const mid = Math.floor(result.length / 2)
  const left = result.slice(0, mid)
  const right = result.slice(mid)
  
  return merge(mergeSort(left, getVal), mergeSort(right, getVal))
}
