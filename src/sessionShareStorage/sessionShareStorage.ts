// 定义一个全局常量，用于在localStorage中存储会话共享信息的键名
const sessionShareChannelKey = '_sessionShareChannelKey_4gv121d12'
// 定义一个共享名称前缀，用于标识sessionStorage中的共享项
const shareName = 'share-'
// 生成一个唯一的请求标识符，用于区分不同的存储事件
const pageRid = 'rid-' + Math.floor(Math.random() * 100000000)
// 构建一个函数，用于生成带前缀的键名
const getKey = function (key: string) {
  return shareName + key
}

// 定义一个函数，用于向localStorage中存储数据
const channel = function (data: any) {
  window.localStorage.setItem(sessionShareChannelKey, JSON.stringify(data))
}

// 创建一个只读的存储对象，用于封装对sessionStorage的操作，并支持跨页面共享
const sessionShareStorage: Storage = Object.freeze({
  // 返回指定索引的键名
  key(index: number) {
    return window.sessionStorage.key(index)
  },
  // 从存储中获取指定键的项
  getItem(key: string) {
    return window.sessionStorage.getItem(getKey(key))
  },
  // 返回存储中键的数量
  get length() {
    return window.sessionStorage.length
  },

  // 向存储中设置一项
  setItem(key: string, value: string) {
    // 发送存储事件，通知其他页面此项被设置
    channel({ type: 'setItem', key: key, value: value })
    // 实际设置存储项
    return window.sessionStorage.setItem(getKey(key), value)
  },
  // 从存储中移除一项
  removeItem(key: string) {
    // 发送存储事件，通知其他页面此项被移除
    channel({ type: 'removeItem', key: key })
    // 实际移除存储项
    return window.sessionStorage.removeItem(getKey(key))
  },
  // 清除存储中所有的项
  clear() {
    // 发送存储事件，通知其他页面存储被清除
    channel({ type: 'clear' })
    // 实际清除存储项
    return window.sessionStorage.clear()
  },
  // 请求其他页面发送其存储内容
  getOtherPageStore() {
    channel({ type: 'getAll', rid: pageRid })
  },
})

// 监听storage事件，以处理来自其他页面的存储变更
window.addEventListener('storage', function (e) {
  // 忽略非会话共享通道键的变更
  if (e.key !== sessionShareChannelKey) return
  // 忽略没有新值的变更
  if (!e.newValue) return

  // 解析事件的新值，获取数据
  const data = JSON.parse(e.newValue)
  // 忽略无效的数据
  if (!data?.type) return

  // 根据事件类型处理存储变更
  if (data.type === 'setItem') window.sessionStorage.setItem(getKey(data.key), data.value)
  if (data.type === 'removeItem') window.sessionStorage.removeItem(getKey(data.key))
  if (data.type === 'clear') window.sessionStorage.clear()

  // 处理请求所有项的事件
  if (data.type === 'getAll' && data.rid !== pageRid) {
    // 序列化当前页面的sessionStorage，仅包括共享项
    const dataStr =
      JSON.stringify(window.sessionStorage, function (key, val) {
        if (key && key.indexOf(shareName) !== 0) return undefined
        return val
      }) ?? '{}'
    // 如果有数据，发送数据给请求的页面
    if (dataStr !== '{}') {
      channel({
        type: 'setAll',
        rid: data.rid,
        data: JSON.parse(dataStr),
      })
    }
  }
  // 接收到其他页面发送的所有项
  if (data.type === 'setAll' && data.rid === pageRid && typeof data.data === 'object') {
    // 将接收到的数据项设置到当前页面的sessionStorage中
    for (const key in data.data) {
      if (key.indexOf(shareName) === 0) window.sessionStorage.setItem(key, data.data[key])
    }
  }

  // 移除本地存储中的会话共享信息，防止重复处理
  window.localStorage.removeItem(sessionShareChannelKey)
})

// 初始化时，请求其他页面的存储内容
sessionShareStorage.getOtherPageStore()

// 导出会话共享存储对象，供其他模块使用
export { sessionShareStorage }
