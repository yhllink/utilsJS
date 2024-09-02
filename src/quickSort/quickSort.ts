/**
 * 快排
 * @param {any[]} arr 待排序的数组
 * @param getVal 获取排序字段的函数，可选
 * @returns {any[]} 排序后的数组
 */
export function quickSort(arr: any[], getVal?: (item: any) => number): any[] {
  // 如果数组长度小于等于1，直接返回数组
  if (arr.length <= 1) return arr

  // 找到中间元素的索引
  const pivotIndex = Math.floor(arr.length / 2)
  // 通过索引取出中间元素作为基准值
  const pivot = arr.splice(pivotIndex, 1)[0]
  // 初始化左侧数组和右侧数组
  const left = []
  const right = []

  // 遍历数组，根据元素与基准值的比较结果，将其放入左侧数组或右侧数组
  for (let i = 0; i < arr.length; i++) {
    // 如果提供了获取排序字段的函数，则根据字段比较大小，否则直接比较元素大小
    if (getVal ? getVal(arr[i]) - getVal(pivot) < 0 : arr[i] - pivot < 0) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  // 递归地对左侧数组和右侧数组进行快排，然后与基准值合并，返回最终的排序结果
  return quickSort(left, getVal).concat([pivot], quickSort(right))
}
