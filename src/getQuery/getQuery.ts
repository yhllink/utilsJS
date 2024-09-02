// 定义搜索参数类型，用于存储键值对字符串参数
type SearchParams = { [k: string]: string }

/**
 * 获取URL.search中的查询参数
 * @param search 要解析的URL.search字符串
 * @returns 解析后的查询参数对象
 */
export const getSearchParams = (function () {
  // 如果浏览器不支持URLSearchParams，则使用兼容方式解析查询参数
  if (typeof URLSearchParams === 'undefined') {
    return function getSearchParams(search: string) {
      const params: SearchParams = {}
      // 将查询字符串分割为键值对，然后添加到params对象中
      for (const [key, val] of (search[0] === '?' ? search.slice(1) : search).split('&').map((i) => i.split('='))) {
        params[key] = val || ''
      }
      return params
    }
  }

  // 如果浏览器支持URLSearchParams，则使用该原生方法解析查询参数
  return function getSearchParams(search: string) {
    const params: SearchParams = {}
    // 解析URL中的查询参数，将其添加到params对象中
    for (const [key, val] of Array.from(new URLSearchParams(search).entries())) {
      params[key] = val || ''
    }
    return params
  }
})()

// 定义查询类型，包括URL查询参数、哈希参数及原始参数对象
type queryType = SearchParams & { _$params: SearchParams; _$hashParams: SearchParams }

/**
 * 获取URL查询参数
 * @param url 要解析的URL，默认为当前页面的URL
 * @returns 返回一个对象，包含URL查询参数、哈希参数及原始参数对象
 */
const getQuery = (function () {
  // 如果浏览器支持URL对象，则使用该原生方法处理URL
  if (typeof URL !== 'undefined') {
    return function getUrlQuery(url = window.location.href): queryType {
      let urlObj
      try {
        // 创建URL对象以解析传入的URL
        urlObj = new URL(url)
      } catch (error) {
        // 如果URL格式错误，返回空的参数对象
        return { _$params: {}, _$hashParams: {} } as queryType
      }

      // 解析查询参数和哈希参数，并返回组合后的参数对象
      const params = urlObj.search ? getSearchParams(urlObj.search) : {}
      const hashParams = urlObj.hash ? getUrlQuery(urlObj.origin + '?' + urlObj.hash)._$params : {}
      return { ...params, ...hashParams, _$params: params, _$hashParams: hashParams } as queryType
    }
  }
  // 如果浏览器不支持URL对象，则使用兼容方式处理URL
  return function getStrQuery(url = window.location.href): queryType {
    const paramsIndex = url.indexOf('?')
    const hashIndex = url.indexOf('#')

    // 提取查询字符串和哈希字符串部分
    const paramsStr = paramsIndex > -1 ? url.slice(paramsIndex).slice(0, hashIndex - paramsIndex > -1 ? hashIndex - paramsIndex : undefined) : ''
    const hashStr = hashIndex > -1 ? url.slice(hashIndex + 1) : ''

    // 如果没有查询字符串和哈希字符串，则返回空的参数对象
    if (paramsStr === '' && hashStr === '') return { _$params: {}, _$hashParams: {} } as queryType

    // 解析查询参数和哈希参数，并返回组合后的参数对象
    const params = paramsStr ? getSearchParams(paramsStr) : {}
    const hashParams = hashStr ? getStrQuery(location.origin + '?' + hashStr)._$params : {}

    return { ...params, ...hashParams, _$params: params, _$hashParams: hashParams } as queryType
  }
})()

// 导出默认的获取查询参数函数
export default getQuery
