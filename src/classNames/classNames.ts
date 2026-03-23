// 定义ClassNameListType类型，它可以是字符串，字符串数组，或键值对对象，其中键是字符串，值是布尔值
type ClassNameListType = string | ClassNameListType[] | { [key: string]: boolean }

/**
 * 函数 classNames 用于将输入的参数转换成一个合并后的类名字符串
 * 它可以处理字符串数组，对象类型的类名，以及嵌套的类名数组
 * @param {...ClassNameListType[]} list 一个或多个类名的字符串、数组或对象
 * @returns {string} 返回一个合并后的类名字符串
 * 
 * @example
 * // 基本用法
 * const cls = classNames('foo', 'bar')
 * console.log(cls) // 'foo bar'
 * 
 * @example
 * // 使用对象
 * const cls = classNames({ foo: true, bar: false })
 * console.log(cls) // 'foo'
 * 
 * @example
 * // 嵌套数组
 * const cls = classNames('a', ['b', 'c'])
 * console.log(cls) // 'a b c'
 */
export function classNames(...list: ClassNameListType[]): string {
  const classList: string[] = []
  
  function process(item: ClassNameListType) {
    if (!item) return
    
    if (Array.isArray(item)) {
      item.forEach(process)
    } else if (typeof item === 'object') {
      for (const key of Object.keys(item)) {
        if (item[key]) classList.push(key)
      }
    } else {
      classList.push(item)
    }
  }
  
  list.forEach(process)
  return classList.join(' ')
}
