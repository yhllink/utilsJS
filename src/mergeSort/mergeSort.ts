/**
 * 归并排序
 * @param {any[]} arr 待排序的数组
 * @param getVal 获取排序字段的函数，可选
 * @returns {any[]} 排序后的数组
 */
export default function mergeSort(arr: any[], getVal?: (item: any) => number): any[] {
  // 当数组长度小于等于1时，不需要排序，直接返回
  if (arr.length <= 1) {
    return arr
  }

  // 计算数组中间位置，用于分割数组
  const mid = Math.floor(arr.length / 2)
  // 分割数组为左右两部分
  const left = arr.slice(0, mid)
  const right = arr.slice(mid)

  /**
   * 合并两个有序数组
   * @param {any[]} left 左侧有序数组
   * @param {any[]} right 右侧有序数组
   * @returns {any[]} 合并后的有序数组
   */
  function merge(left: any[], right: any[]): any[] {
    // 初始化左右数组的索引
    let [l, r] = [0, 0]
    // 初始化结果数组
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

  // 递归调用mergeSort对左右两部分进行排序，并将排序后的结果合并
  return merge(mergeSort(left, getVal), mergeSort(right, getVal))
}
