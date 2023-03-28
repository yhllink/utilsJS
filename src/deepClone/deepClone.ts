/**
 * 深拷贝函数
 * @param obj 需要拷贝的对象
 * @returns 拷贝后的新对象
 */
function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  const newObj: any = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key])
    }
  }
  return newObj
}
export default deepClone
