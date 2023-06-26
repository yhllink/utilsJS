import ifType from '../ifType/ifType'
import structure from '../structure/structure'

type Form = AnyObj
type RuleType = 'any' | 'phone' | 'email' | 'telephone' | Function

interface Rule {
  type?: RuleType | RuleType[] | Function
  message?: string
  custom?: (key: string, data: any, form: Form) => string | void
  middle?: (key: string, data: any, form: Form) => string | void
  minLength?: number
  maxLength?: number
}

let messageError: (msg: string) => void
export const setCheckFormMessage = function (message: (msg: string) => void) {
  messageError = message
}

// 表单验证单项
function checkFormItem(key: string, form: Form, data: any, rule: Rule): boolean | { code: 200 | 400; message: string } {
  // 如果是自定义规则
  if (typeof rule.custom === 'function') {
    const message = rule.custom(key, data, form)
    return { code: message ? 400 : 200, message: String(message) }
  }

  // 获取规则类型
  const { type, minLength, maxLength } = rule

  // any 规则 不为空
  if (type === 'any') return !ifType(['', undefined, null, NaN], data)

  // Array 验证数组并且不为空
  if (type === Array && minLength === undefined && maxLength === undefined) return !!(Array.isArray(data) && data.length)

  // phone 验证手机号
  if (type === 'phone') return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(String(data))

  // phone 验证手机号
  if (type === 'telephone') return /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/.test(String(data))

  // email 验证邮箱
  if (type === 'email') {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      data
    )
  }

  // 长度验证
  if ((type === Number || type === String || type === Array) && typeof minLength === 'number' && typeof maxLength === 'number') {
    // 如果是数字 或者 纯数字字符串
    if (type === Number || type === String) {
      // 判断大小
      if (data < minLength) return false
      if (data > maxLength) return false
    } else {
      if (data.length < minLength) return false
      if (data.length > maxLength) return false
    }
  }

  // 验证数据类型
  return ifType(type, data)
}

// 遍历验证
function checkRuleItem(rule: string | Rule, form: Form, key: string, autoToast: boolean) {
  // 将不是对象规则变更为 对象
  switch (typeof rule) {
    case 'function':
      rule = { custom: rule }
      break
    case 'string':
      rule = { message: rule }
      break
  }

  // 如果没有规则类型
  if (!rule.type) rule.type = 'any'

  // 如果规则类型不是数组 将 类型改为数组
  if (!Array.isArray(rule.type)) rule.type = [rule.type]

  // 定义 循环查询结果
  const inspect = []
  for (let i = 0; i < rule.type.length; i++) {
    const itemRule: Rule = { ...rule, type: rule.type[i] }

    // 验证数据
    let bool = checkFormItem(key, form, structure(key, form), itemRule)
    if (!bool && itemRule.middle) {
      const middleMessage = itemRule.middle(key, form[key], form)
      if (middleMessage) {
        bool = false
        itemRule.message = middleMessage
      }
    }

    // 将结果push 到 查询结果
    if (typeof bool === 'boolean') {
      inspect.push({ code: bool ? 200 : 400, key, ...itemRule })
    } else if (bool && typeof bool === 'object') {
      inspect.push({ ...bool, key, ...itemRule })
    }
  }

  // 如果当前规则查询 没有正确结果
  const fileList = inspect.filter((i) => i.code == 400)
  if (fileList.length === inspect.length) {
    // 获取当前规则第一个错误结果
    const failRule = fileList[0]
    // 如果开启了 自动toast 展示 toast
    if (autoToast && failRule.message && messageError) messageError(failRule.message)
    // 返回 错误结果
    return { ...failRule, inspect }
  }

  // 如果所有查询都正确 返回正确结果
  return { code: 200, inspect }
}

export interface rulesType {
  [key: string]: string | Rule | Rule[] | ((key: string, data: any, form: Form) => string | void)
}

/**
 * 表单验证
 *
 * @export
 * @param {Object} form={} 数据
 * @param {Object} 规则
 *  key : [{
 *    type:[数据类型|'phone','any','email','telephone',Array],
 *    message:提示文案,
 *    custom:自定义验证方法,返回message,
 *    minLength:数字|字符串|数组最小长度,
 *    maxLength:数字|字符串|数组最大长度
 *  }]
 * @param {Boolean} 是否自动toast
 * @returns {Object} {code,message} 验证结果
 */
export default function checkForm(form: Form, rules: rulesType, autoToast: boolean = true): { code: 200 | 400; message?: string; inspect?: AnyObj } {
  // 创建验证结果记录
  const inspect: AnyObj = {}

  // 遍历规则
  for (const key in rules) {
    const rule = Array.isArray(rules[key]) ? rules[key] : [rules[key]]
    if (!Array.isArray(rule)) return { code: 400, message: '规则错误' }

    let check: any = false
    for (let i = 0, l = rule.length; i < l; i++) {
      if (check) break

      const res = checkRuleItem(<string | Rule>rule[i], form, key, autoToast)
      if (res.code === 200 || i === rule.length - 1) {
        check = res
        break
      }
    }

    inspect[key] = check.inspect

    if (check.code !== 200) {
      return { ...check, inspect, data: form[key] }
    }
  }

  // 如果所有查询都正确 返回正确结果
  return { code: 200, inspect }
}
