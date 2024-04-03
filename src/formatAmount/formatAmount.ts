const formatAmount = function (value: string | number, decimalPlaces: number = 2) {
  const numValue = parseFloat(String(value))
  if (typeof numValue !== 'number' || isNaN(numValue)) return value

  const formattedValue = numValue.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
  return formattedValue
}
export default formatAmount
