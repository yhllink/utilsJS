import isServer from '../isServer/isServer'

const sessionShareStorage = (function () {
  if (isServer) {
    return Object.freeze({
      key: (index: number) => '',
      getItem: (key: string) => '',
      length: 0,
      setItem(key: string, value: string) {},
      removeItem(key: string) {},
      clear() {},
      getOtherPageStore() {},
    } as Storage)
  }

  const shareName = 'share-'
  const pageRid = 'rid-' + Math.floor(Math.random() * 100000000)
  const channel = new BroadcastChannel('sessionShareStorage')

  const sessionShareStorage: Storage = Object.freeze({
    key(index: number) {
      return window.sessionStorage.key(index)
    },
    getItem(key: string) {
      return window.sessionStorage.getItem(shareName + key)
    },
    get length() {
      return window.sessionStorage.length
    },

    setItem(key: string, value: string) {
      channel.postMessage({ type: 'setItem', key: key, value: value })
      return window.sessionStorage.setItem(shareName + key, value)
    },
    removeItem(key: string) {
      channel.postMessage({ type: 'removeItem', key: key })
      return window.sessionStorage.removeItem(shareName + key)
    },
    clear() {
      channel.postMessage({ type: 'clear' })
      return window.sessionStorage.clear()
    },
    getOtherPageStore() {
      channel.postMessage({ type: 'getAll', rid: pageRid })
    },
  })

  channel.onmessage = function (e) {
    const data = e.data

    if (data?.type === 'setItem') window.sessionStorage.setItem(shareName + data.key, data.value)
    if (data?.type === 'removeItem') window.sessionStorage.removeItem(shareName + data.key)
    if (data?.type === 'clear') window.sessionStorage.clear()

    if (data?.type === 'getAll' && data?.rid && data.rid !== pageRid) {
      channel.postMessage({
        type: 'setAll',
        rid: data.rid,
        data: JSON.parse(
          JSON.stringify(window.sessionStorage, function (key, val) {
            if (key && key.indexOf(shareName) !== 0) return undefined
            return val
          }) ?? '{}'
        ),
      })
    }
    if (data?.type === 'setAll' && data?.rid === pageRid) {
      for (const key in data.data) {
        if (key.indexOf(shareName) === 0) window.sessionStorage.setItem(key, data.data[key])
      }
    }
  }

  sessionShareStorage.getOtherPageStore()
  return sessionShareStorage
})()

export default sessionShareStorage
