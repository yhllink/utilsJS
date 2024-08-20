/**
 * 获取URL和hash中的参数并转换为对象
 * @param {string} url 需要解析的URL，默认为当前页面URL
 * @returns {object} 解析后的参数对象
 */
export default function getQuery(url = window.location.href) {
  // 分割URL，获取查询字符串部分，如果没有查询字符串，默认为空字符串
  const search = url.split('?')[1] || ''
  // 分割URL，获取hash部分，如果没有hash，默认为空字符串
  const hash = url.split('#')[1] || ''
  // 将查询字符串和hash部分按照"&"分割，并展开为一个数组
  const queryArr = [...search.split('&'), ...hash.split('&')]
  // 初始化一个空对象，用于存储解析后的参数
  const queryObj: { [key: string]: string } = {}
  // 遍历参数数组，解析每一对键值对
  queryArr.forEach((item) => {
    // 分割每一项，获取键名和键值
    const [key, value] = item.split('=')
    // 如果键名存在，将键值进行URL解码后存入对象
    if (key) {
      queryObj[key] = decodeURIComponent(value)
    }
  })
  // 返回解析后的参数对象
  return queryObj
}
