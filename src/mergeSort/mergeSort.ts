/**
 * 归并排序
 * @param {any[]} arr
 * @param getVal 获取排序字段
 * @returns {any[]}
 */
export default function mergeSort(arr: any[], getVal?: (item: any) => number): any[] {
  if (arr.length <= 1) {
    return arr
  }

  const mid = Math.floor(arr.length / 2)
  const left = arr.slice(0, mid)
  const right = arr.slice(mid)

  function merge(left: any[], right: any[]): any[] {
    let [l, r] = [0, 0]
    let result = []
    // 从 left 和 right 区域中各个取出第一个元素，比较它们的大小
    while (l < left.length && r < right.length) {
      // 将较小的元素添加到result中，然后从较小元素所在的区域内取出下一个元素，继续进行比较；
      if (getVal ? getVal(left[l]) < getVal(right[r]) : left[l] < right[r]) {
        result.push(left[l])
        l++
      } else {
        result.push(right[r])
        r++
      }
    }
    // 如果 left 或者 right 有一方为空，则直接将另一方的所有元素依次添加到result中
    result = result.concat(left.slice(l, left.length))
    result = result.concat(right.slice(r, right.length))
    return result
  }

  return merge(mergeSort(left, getVal), mergeSort(right, getVal))
}
