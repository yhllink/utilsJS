import { hasVal } from '@/hasVal/hasVal'

/**
 * 根据给定的键获取对象中的数据项
 * @param {string} key - 要获取的数据项的键名
 * @param {object} data - 包含数据的对象
 * @param {any} defaultVal - 如果无法获取数据项时的默认值
 * @returns {any} - 获取到的数据项或默认值
 * 
 * @example
 * // 基本用法
 * const data = { user: { name: 'John' } }
 * const name = structureItem('user.name', data, 'default')
 * console.log(name) // 'John'
 * 
 * @example
 * // 处理 null/undefined
 * const data = { user: null }
 * const name = structureItem('user.name', data, 'default')
 * console.log(name) // 'default'
 */
function structureItem(key: string, data: object, defaultVal: any) {
  // 如果键名为空，直接返回原始数据或默认值
  if (key === '') return data ?? defaultVal

  // 使用安全的属性访问方式，避免 eval 安全漏洞
  try {
    let val: any = data
    const keys: string[] = key.split('.')
    
    for (let i = 0, l = keys.length; i < l; i++) {
      // 如果当前值为 null 或 undefined，直接返回默认值
      if (val === null || val === undefined) {
        return defaultVal
      }
      val = val[keys[i]]
    }
    
    return val
  } catch (error) {
    // 如果访问失败，返回默认值
    return defaultVal
  }
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
