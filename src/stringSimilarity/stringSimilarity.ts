/**
 * 计算两个字符串之间的Levenshtein距离
 * Levenshtein距离是指两个字符串之间，由一个转换成另一个所需的最少编辑操作次数
 * @param a 第一个字符串
 * @param b 第二个字符串
 * @returns 返回Levenshtein距离
 */
function levenshteinDistance(a: string, b: string) {
  // 创建一个矩阵来存储计算结果
  const matrix = []

  // 如果一个字符串为空，则直接返回另一个字符串的长度作为编辑距离
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // 初始化矩阵的第一行和第一列
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // 逐个字符进行比较，计算编辑距离
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 替换操作
          matrix[i][j - 1] + 1, // 插入操作
          matrix[i - 1][j] + 1 // 删除操作
        )
      }
    }
  }

  // 返回最终计算出的编辑距离
  return matrix[b.length][a.length]
}

/**
 * 计算两个字符串的相似度
 * 相似度是基于Levenshtein距离计算的，相似度范围在0到1之间，1表示完全相同，0表示完全不同
 * @param str1 第一个字符串
 * @param str2 第二个字符串
 * @returns 返回字符串的相似度
 */
export function stringSimilarity(str1: string, str2: string) {
  // 计算两个字符串的Levenshtein距离
  const distance = levenshteinDistance(str1, str2)
  // 找出两个字符串中较长的一个
  const maxLength = Math.max(str1.length, str2.length)
  // 防止除以0的情况
  if (maxLength === 0) return 1.0
  // 计算并返回相似度
  return (maxLength - distance) / maxLength
}
