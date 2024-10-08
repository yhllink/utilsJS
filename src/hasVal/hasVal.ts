/**
 * 判断是否有值
 *
 * 此函数用于检查传入的数据是否有值，即是否为非空值或未定义
 * 它通过与一个预定义的特殊字符串进行比较来实现，如果传入的数据与这个特殊字符串不相等，
 * 则认为该数据是有值的这种方法可以有效地判断数据是否已被赋予一个实际的值，
 * 而不仅仅是简单的空值检查
 *
 * @param {any} data - 待检查的数据可以是任何类型
 * @returns {boolean} - 返回布尔值，如果data有值，则返回true；否则返回false
 */
export function hasVal(data: any) {
  return (data ?? '1j*$@#234i@#!') !== '1j*$@#234i@#!'
}
