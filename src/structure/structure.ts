import { hasVal } from '../hasVal/hasVal'

/**
 * 根据给定的键获取对象中的数据项
 * @param {string} key - 要获取的数据项的键名
 * @param {object} data - 包含数据的对象
 * @param {any} defaultVal - 如果无法获取数据项时的默认值
 * @returns {any} - 获取到的数据项或默认值
 */
function structureItem(key: string, data: object, defaultVal: any) {
  // 如果键名为空，直接返回原始数据或默认值
  if (key === '') return data ?? defaultVal

  try {
    // 尝试使用window对象动态生成代码并执行，以获取嵌套键的值
    const wind: { [key: string]: any } = window

    // 生成一个随机的临时变量名
    const name: string = `sdcsvasv${Math.floor(Math.random() * 10000)}`
    // 将数据对象存储在临时变量中
    wind['data_' + name] = data
    // 通过eval动态执行代码，以访问嵌套的键
    window.eval(`window.val_${name} = window.data_${name}.${key}`)
    // 获取计算后的值
    const value = wind['val_' + name]
    // 清理临时变量，避免内存泄漏
    wind['val_' + name] = null
    wind['data_' + name] = null
    return value
  } catch (error) {}

  try {
    // 如果动态执行失败，尝试通过手动分割键名并逐级访问对象的方式来获取值
    let val: { [key: string]: any } = data
    const keys: string[] = key.split('.')
    for (let i = 0, l = keys.length; i < l; i++) val = val[keys[i]]
    return val
  } catch (error) {}

  // 如果所有尝试都失败，则返回默认值
  return defaultVal
}

/**
 * 根据给定的键列表和数据对象，获取指定键的数据
 * 如果给定的是单个键字符串，将直接调用structureItem函数
 * 如果给定的是键的数组，将依次尝试每个键直到找到有效值或返回默认值
 * @param {string | string[]} keys - 要获取数据的键名或键名列表
 * @param {object} data - 包含数据的对象
 * @param {any} defaultVal - 如果无法获取数据项时的默认值
 * @returns {any} - 获取到的数据项或默认值
 */
export function structure(keys: string | string[], data: object, defaultVal: any = undefined) {
  // 如果keys不是数组，直接调用structureItem函数处理
  if (!Array.isArray(keys)) return structureItem(keys, data, defaultVal)

  // 如果keys是数组，依次尝试每个键直到找到有效值或返回默认值
  for (let i = 0, l = keys.length; i < l; i++) {
    const val = structureItem(keys[i], data, false)
    if (hasVal(val)) return val
  }

  // 如果所有键都无法获取到有效值，返回默认值
  return defaultVal
}
