function structureItem(key: string, data: object, defaultVal: any) {
  try {
    const wind: { [key: string]: any } = window

    const name: string = `sdcsvasv${Math.floor(Math.random() * 10000)}`
    wind['data_' + name] = data
    window.eval(`window.val_${name} = window.data_${name}.${key}`)
    const value = wind['val_' + name]
    wind['data_' + name] = wind['val_' + name] = null
    return value
  } catch (error) {}

  try {
    let val: { [key: string]: any } = data
    const keys: string[] = key.split('.')
    for (let i = 0, l = keys.length; i < l; i++) val = val[keys[i]]
    return val
  } catch (error) {}

  return defaultVal
}

/**
 * 获取对象数据中指定key的数据
 * @param {String} key // 数据中的key eg. a.b.c.d
 * @param {Object} data // 数据
 * @param {any} defaultVal // 如果找不到指定数据情况下的默认值
 * @returns {any}
 */
export default function structure(keys: string, data: object, defaultVal: any = undefined) {
  if (!Array.isArray(keys)) return structureItem(keys, data, defaultVal)

  for (let i = 0, l = keys.length; i < l; i++) {
    const val = structureItem(keys[i], data, false)
    if (val) return val
  }

  return defaultVal
}
