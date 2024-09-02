import { formatNumber } from '../formatNumber/formatNumber'

/**
 * 计算金额
 * @param {string | number} money 金额
 * @returns {string} 处理后的金额
 */
export function formatAmount(
  money: string | number,
  options?: {
    auto?: boolean
    max?: number
    maxStr?: string
    decimalPlaces?: number
    module?: boolean
  }
) {
  // 默认参数设置
  const { auto = true, max = 10000, maxStr = '万', decimalPlaces = 2, module = false } = options || {}

  // 将金额转换为数字类型
  const numMoney = Number(money)

  // 根据auto参数值，动态设置金额上限和单位
  const [endMax, endStr] = (() => {
    if (auto) {
      if (numMoney >= 100000000) return [100000000, '亿']
      if (numMoney >= 10000000) return [10000, '万']
    }

    return [max, maxStr]
  })()

  // 如果金额小于1万，直接格式化并返回
  if (numMoney < 10000) {
    const amount = formatNumber(numMoney, decimalPlaces)
    if (module) return [amount, '']
    return amount
  }

  // 格式化金额并加上单位，根据module参数值返回不同格式的结果
  const amount = formatNumber(numMoney / endMax, decimalPlaces)
  if (module) return [amount, endStr]
  return amount + endStr
}
