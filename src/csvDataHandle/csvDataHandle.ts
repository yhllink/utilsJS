type Option = { keysObj?: { [key: string]: string }; middle?: (key: string, val: string) => any; filter?: (item: AnyObj) => boolean }

/**
 * 处理CSV数据并将其转换为对象数组
 *
 * @param csv 待处理的CSV字符串
 * @param option 可选配置对象，包含键映射、中间处理函数和过滤器
 * @returns 返回处理后的对象数组
 */
export function csvDataHandle<T = AnyObj>(csv: string, option?: Option): T[] {
  // 将CSV字符串按行分割成数组
  const csvList = csv.split('\n')

  // 创建一个空数组用于存储处理后的对象
  const arr: AnyObj[] = []

  // 提取CSV的第一行作为键名
  const keys = csvList[0].split(',')
  // 从第二行开始遍历CSV数据
  for (let i = 1, l = csvList.length; i < l; i++) {
    // 将当前行数据按逗号分割成数组
    const item = csvList[i].split(',')

    // 创建一个空对象用于存储键值对
    const obj: AnyObj = {}
    // 遍历键名数组
    for (let j = 0, l = keys.length; j < l; j++) {
      // 获取当前键名，如果配置了键映射则使用映射后的键名
      const key = option?.keysObj?.[keys[j]] || keys[j]
      // 根据配置的中间处理函数处理值，如果没有配置则默认去除值的首尾空格
      obj[key] = option?.middle ? option.middle(key, item[j]) : item[j].trim()
    }
    // 如果配置了过滤器且当前对象不满足过滤器条件，则跳过当前对象
    if (option?.filter) if (!option.filter(obj)) continue

    // 如果对象有属性，则将其添加到结果数组中
    if (Object.keys(obj).length) arr.push(obj)
  }

  // 将结果数组转换为指定类型并返回
  return arr as T[]
}
