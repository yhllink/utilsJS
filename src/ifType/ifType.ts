import isType from '../isType/isType'

function ifTypeItem(type: any, data: any) {
  if (typeof type === 'string') {
    const trueType = isType(data)
    // @ts-ignore
    return type === trueType || type?.name === trueType
  }

  if (type === 'Array' || type === Array) {
    return Array.isArray(data)
  }

  return data instanceof type
}

/**
 * 判断数据类型是否为传入类型
 * @param {String|type} type // 数据类型 'String'||String
 * @param {any} data // '数据'
 * @returns {Boolean}
 */
export default function ifType(types: any, data: any): boolean {
  if (!Array.isArray(types)) types = [types]

  for (let i = 0, l = types.length; i < l; i++) {
    if (ifTypeItem(types[i], data)) return true
  }

  return false
}
