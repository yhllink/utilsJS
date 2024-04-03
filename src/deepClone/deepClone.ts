/**
 * 深拷贝函数
 * @param {any} obj 需要拷贝的对象
 * @returns {any} 拷贝后的新对象
 */
function deepClone(obj: any) {
  // 创建一个 Map 来存储已经复制过的对象
  const copiedObjects = new Map()
  // 创建一个队列来迭代遍历待复制对象的属性
  const queue: { original: any; copy: any }[] = [{ original: obj, copy: {} }]

  while (queue.length > 0) {
    const { original, copy } = queue.shift()!

    for (const key in original) {
      if (Object.prototype.hasOwnProperty.call(original, key)) {
        const value = original[key]

        if (typeof value === 'object' && value !== null) {
          // 如果已经复制过该对象，则直接取出复制后的对象
          if (copiedObjects.has(value)) {
            copy[key] = copiedObjects.get(value)
          } else {
            // 否则，创建一个新对象并入队等待处理
            const newValue = Array.isArray(value) ? [] : {}
            copiedObjects.set(value, newValue)
            copy[key] = newValue
            queue.push({ original: value, copy: newValue })
          }
        } else {
          // 对于基本类型直接复制值
          copy[key] = value
        }
      }
    }
  }

  return copiedObjects.get(obj)
}

export default deepClone
