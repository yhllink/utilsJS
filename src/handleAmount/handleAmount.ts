/**
 * 计算金额
 * @param {string | number} money 金额
 * @returns {string} 处理后的金额
 */
const handleAmount = function (money: string | number, max: number = 10000, maxStr: string = '万') {
  const numMoney = Number(money)

  if (numMoney < max) return numMoney.toFixed(2)
  return (numMoney / max).toFixed(2) + maxStr
}

export default handleAmount
