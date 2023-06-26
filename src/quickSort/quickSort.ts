/**
 * 快排
 * @param arr 
 * @param sort 
 * @returns 
 */
function quickSort(arr: any[], sort?: (item: any) => number): any[] {
  if (arr.length <= 1) {
    return arr
  }
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr.splice(pivotIndex, 1)[0]
  const left = []
  const right = []
  for (let i = 0; i < arr.length; i++) {
    if (sort ? sort(arr[i]) - sort(pivot) < 0 : arr[i] - pivot < 0) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left, sort).concat([pivot], quickSort(right))
}
export default quickSort
