/**
 * 深拷贝函数
 * @param {any} obj 需要拷贝的对象
 * @returns {any} 拷贝后的新对象
 */
export function deepClone(obj: any) {
  // 存储已复制的对象及其副本的映射
  const copiedObjects = new WeakMap()

  // 辅助函数来创建不同类型的新实例
  function createInstance(value: any) {
    if (value instanceof Date) return new Date(value)
    if (value instanceof RegExp) return new RegExp(value)
    if (value instanceof Blob) return new Blob([value], { type: value.type })
    if (value instanceof Map) return new Map(value)
    if (value instanceof Set) return new Set(value)
    if (Array.isArray(value)) return []
    if (typeof value === 'object' && value !== null) return {}
    return value
  }

  // 检查是否为简单值或不需要深拷贝的类型
  function isSimpleValue(value: any) {
    return typeof value !== 'object' || value === null || value instanceof Blob || typeof value === 'function'
  }

  // 处理循环引用和其他复杂对象
  function cloneDeep(value: any) {
    if (isSimpleValue(value)) return value

    if (copiedObjects.has(value)) return copiedObjects.get(value)

    const copy = createInstance(value)
    copiedObjects.set(value, copy)

    if (value instanceof Map) {
      value.forEach((val, key) => {
        copy.set(cloneDeep(key), cloneDeep(val))
      })
    } else if (value instanceof Set) {
      value.forEach((val) => {
        copy.add(cloneDeep(val))
      })
    } else {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          copy[key] = cloneDeep(value[key])
        }
      }
    }

    return copy
  }

  return cloneDeep(obj)
}
