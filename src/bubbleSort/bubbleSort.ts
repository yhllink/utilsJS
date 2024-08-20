/**
 * 出口默认的冒泡排序函数
 * @param arr 待排序的数组，数组元素类型不限
 * @param getVal 可选的回调函数，用于获取每个元素的排序值，如果提供，则使用该函数比较元素
 * @returns 排序后的数组
 */
export default function bubbleSort(arr: any[], getVal?: (item: any) => number): any[] {
  // 获取数组长度
  const length = arr.length
  // 遍历数组，进行冒泡排序
  for (let i = 0; i < length - 1; i++) {
    // 每次遍历，将当前最大的元素移到数组末尾
    for (let j = 0; j < length - 1 - i; j++) {
      // 根据getVal回调或直接比较元素大小，决定元素交换
      if (getVal ? getVal(arr[j]) - getVal(arr[j + 1]) < 0 : arr[j] - arr[j + 1] < 0) {
        // 交换元素位置
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  // 返回排序后的数组
  return arr
}
