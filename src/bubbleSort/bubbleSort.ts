/**
 * 冒泡排序
 * @param arr 
 * @param sort 
 * @returns 
 */
function bubbleSort(arr: any[], sort?: (item: any) => number): any[] {
  const length = arr.length
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (sort ? sort(arr[j]) - sort(arr[j + 1]) < 0 : arr[j] - arr[j + 1] < 0) {
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}
export default bubbleSort
