type Option = { keysObj?: { [key: string]: string }; middle?: (key: string, val: string) => any; filter?: (item: AnyObj) => boolean }

/**
 * 处理 CSV 数据并将其转换为对象数组
 *
 * @param csv 待处理的 CSV 字符串
 * @param option 可选配置对象，包含键映射、中间处理函数和过滤器
 * @returns 返回处理后的对象数组
 * 
 * @example
 * // 基本用法
 * const csv = 'name,age\nJohn,25\nJane,30'
 * const result = csvDataHandle(csv)
 * console.log(result) // [{ name: 'John', age: '25' }, { name: 'Jane', age: '30' }]
 * 
 * @example
 * // 使用配置
 * const csv = 'name,age\nJohn,25\nJane,30'
 * const result = csvDataHandle(csv, {
 *   keysObj: { name: 'userName' },
 *   middle: (key, val) => key === 'age' ? Number(val) : val
 * })
 */
export function csvDataHandle<T = AnyObj>(csv: string, option?: Option): T[] {
  const lines = csv.split('\n')
  if (lines.length === 0) return []
  
  const keys = lines[0].split(',')
  const result: T[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length !== keys.length) continue
    
    const obj: AnyObj = {}
    let hasValue = false
    
    for (let j = 0; j < keys.length; j++) {
      const key = option?.keysObj?.[keys[j]] || keys[j]
      const value = option?.middle ? option.middle(key, values[j]) : values[j].trim()
      
      if (value !== '') hasValue = true
      obj[key] = value
    }
    
    if (hasValue && (!option?.filter || option.filter(obj))) {
      result.push(obj as T)
    }
  }
  
  return result
}
