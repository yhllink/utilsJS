// 定义ClassNameListType类型，它可以是字符串，字符串数组，或键值对对象，其中键是字符串，值是布尔值
type ClassNameListType = string | ClassNameListType[] | { [key: string]: boolean }

/**
 * 函数classNames用于将输入的参数转换成一个合并后的类名字符串
 * 它可以处理字符串数组，对象类型的类名，以及嵌套的类名数组
 * @param {...ClassNameListType[]} list 一个或多个类名的字符串、数组或对象
 * @returns {string} 返回一个合并后的类名字符串
 */
export function classNames(...list: ClassNameListType[]): string {
  const classList = [] // 初始化一个空数组来存储最终的类名

  // 循环遍历传入的所有参数
  for (let i = 0, l = list.length; i < l; i++) {
    const item = list[i]
    if (!item) continue // 如果当前项为空，则跳过

    // 如果当前项是数组，则递归调用classNames函数并将结果加入到classList中
    if (Array.isArray(item)) {
      classList.push(classNames(...item))
      continue
    }

    // 如果当前项是对象，则遍历其键值对，如果值为true，则将键名加入到classList中
    if (typeof item === 'object') {
      Object.keys(item).forEach((key) => {
        if (item[key]) classList.push(key)
      })
      continue
    }

    classList.push(item) // 如果当前项是字符串，则直接加入到classList中
  }

  // 使用Boolean函数过滤掉Falsy值（如空字符串、0等），然后使用空格连接符将classList数组中的所有元素合并成一个字符串
  return classList.filter(Boolean).join(' ')
}
