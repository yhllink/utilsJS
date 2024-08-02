import formatAmount from '../formatAmount/formatAmount'

/**
 * 计算金额
 * @param {string | number} money 金额
 * @returns {string} 处理后的金额
 */
export default function handleAmount(
  money: string | number,
  {
    auto = true,
    max = 10000,
    maxStr = '万',
    decimalPlaces = 2,
    module = false,
  }: {
    auto?: boolean
    max?: number
    maxStr?: string
    decimalPlaces?: number
    module?: boolean
  } = {}
) {
  const numMoney = Number(money)

  const [endMax, endStr] = (() => {
    if (auto) {
      if (numMoney >= 100000000) return [100000000, '亿']
      if (numMoney >= 10000000) return [10000, '万']
    }

    return [max, maxStr]
  })()

  if (numMoney < 10000) {
    const amount = formatAmount(numMoney, decimalPlaces)
    if (module) return [amount, '']
    return amount
  }

  const amount = formatAmount(numMoney / endMax, decimalPlaces)
  if (module) return [amount, endStr]
  return amount + endStr
}
