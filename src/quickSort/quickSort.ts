/**
 * 快排
 * @param {any[]} arr
 * @param getVal 获取排序字段
 * @returns {any[]}
 */
export default function quickSort(arr: any[], getVal?: (item: any) => number): any[] {
  if (arr.length <= 1) return arr

  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr.splice(pivotIndex, 1)[0]
  const left = []
  const right = []
  for (let i = 0; i < arr.length; i++) {
    if (getVal ? getVal(arr[i]) - getVal(pivot) < 0 : arr[i] - pivot < 0) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left, getVal).concat([pivot], quickSort(right))
}
