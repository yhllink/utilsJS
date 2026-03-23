/**
 * 深拷贝函数
 * @param {any} obj 需要拷贝的对象
 * @returns {any} 拷贝后的新对象
 * 
 * @example
 * // 基本用法
 * const obj = { a: 1, b: { c: 2 } }
 * const copy = deepClone(obj)
 * console.log(copy) // { a: 1, b: { c: 2 } }
 * 
 * @example
 * // 处理特殊类型
 * const obj = { date: new Date(), arr: [1, 2, 3] }
 * const copy = deepClone(obj)
 * console.log(copy.date instanceof Date) // true
 */
export function deepClone(obj: any) {
  const copiedObjects = new WeakMap()
  
  function cloneDeep(value: any): any {
    // 原始值和函数直接返回
    if (value === null || typeof value !== 'object') {
      return value
    }
    
    // 处理循环引用
    if (copiedObjects.has(value)) {
      return copiedObjects.get(value)
    }
    
    let copy: any
    
    // 特殊类型处理
    if (value instanceof Date) {
      copy = new Date(value)
    } else if (value instanceof RegExp) {
      copy = new RegExp(value)
    } else if (value instanceof Blob) {
      copy = new Blob([value], { type: value.type })
    } else if (value instanceof Map) {
      copy = new Map(Array.from(value.entries()).map(([k, v]) => [cloneDeep(k), cloneDeep(v)]))
    } else if (value instanceof Set) {
      copy = new Set(Array.from(value).map(cloneDeep))
    } else if (Array.isArray(value)) {
      copy = value.map(cloneDeep)
    } else {
      copy = Object.create(Object.getPrototypeOf(value))
      for (const key of Object.keys(value)) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          copy[key] = cloneDeep(value[key])
        }
      }
    }
    
    copiedObjects.set(value, copy)
    return copy
  }
  
  return cloneDeep(obj)
}
