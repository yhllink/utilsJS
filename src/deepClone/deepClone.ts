/**
 * 深拷贝函数
 * @param {any} obj 需要拷贝的对象
 * @returns {any} 拷贝后的新对象
 */
export function deepClone(obj: any) {
  // 存储已复制的对象及其副本的映射
  const copiedObjects = new Map()
  // 存储待处理的对象及其副本的队列
  const queue: { original: any; copy: any }[] = [{ original: obj, copy: {} }]

  // 当队列中有待处理的对象时，继续循环
  while (queue.length > 0) {
    // 从队列中取出一对对象及其副本
    const { original, copy } = queue.shift()!

    // 遍历原始对象的属性
    for (const key in original) {
      // 确保属性属于原始对象本身，而不是原型链上的属性
      if (Object.prototype.hasOwnProperty.call(original, key)) {
        const value = original[key]

        // 如果属性值是对象（且不为null），则需要进一步处理
        if (typeof value === 'object' && value !== null) {
          // 如果该对象已经复制过，则直接使用已有的副本
          if (copiedObjects.has(value)) {
            copy[key] = copiedObjects.get(value)
          } else {
            // 创建一个新的空对象或数组作为新的副本
            const newValue = Array.isArray(value) ? [] : {}
            // 将新的副本存储到映射中
            copiedObjects.set(value, newValue)
            // 将新的副本赋值给当前属性
            copy[key] = newValue
            // 将新的对象及其副本加入队列，以供后续处理
            queue.push({ original: value, copy: newValue })
          }
        } else {
          // 如果属性不是对象，则直接复制值
          copy[key] = value
        }
      }
    }
  }

  // 返回最初对象的副本
  return copiedObjects.get(obj)
}
