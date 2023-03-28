/**
 * 获取URL和hash中的参数并转换为对象
 * @param {string} url 需要解析的URL，默认为当前页面URL
 * @returns {object} 解析后的参数对象
 */
function getQuery(url = window.location.href) {
  const search = url.split('?')[1] || ''
  const hash = url.split('#')[1] || ''
  const queryArr = [...search.split('&'), ...hash.split('&')]
  const queryObj: { [key: string]: string } = {}
  queryArr.forEach((item) => {
    const [key, value] = item.split('=')
    if (key) {
      queryObj[key] = decodeURIComponent(value)
    }
  })
  return queryObj
}
export default getQuery
