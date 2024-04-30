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

  const sessionShareChannelKey = '_sessionShareChannelKey_4gv121d12'
  const shareName = 'share-'
  const pageRid = 'rid-' + Math.floor(Math.random() * 100000000)
  const getKey = function (key: string) {
    return shareName + key
  }

  const channel = function (data: any) {
    window.localStorage.setItem(sessionShareChannelKey, JSON.stringify(data))
  }

  const sessionShareStorage: Storage = Object.freeze({
    key(index: number) {
      return window.sessionStorage.key(index)
    },
    getItem(key: string) {
      return window.sessionStorage.getItem(getKey(key))
    },
    get length() {
      return window.sessionStorage.length
    },

    setItem(key: string, value: string) {
      channel({ type: 'setItem', key: key, value: value })
      return window.sessionStorage.setItem(getKey(key), value)
    },
    removeItem(key: string) {
      channel({ type: 'removeItem', key: key })
      return window.sessionStorage.removeItem(getKey(key))
    },
    clear() {
      channel({ type: 'clear' })
      return window.sessionStorage.clear()
    },
    getOtherPageStore() {
      channel({ type: 'getAll', rid: pageRid })
    },
  })

  window.addEventListener('storage', function (e) {
    if (e.key !== sessionShareChannelKey) return
    if (!e.newValue) return

    const data = JSON.parse(e.newValue)
    if (!data?.type) return

    if (data.type === 'setItem') window.sessionStorage.setItem(getKey(data.key), data.value)
    if (data.type === 'removeItem') window.sessionStorage.removeItem(getKey(data.key))
    if (data.type === 'clear') window.sessionStorage.clear()

    if (data.type === 'getAll' && data.rid !== pageRid) {
      const dataStr =
        JSON.stringify(window.sessionStorage, function (key, val) {
          if (key && key.indexOf(shareName) !== 0) return undefined
          return val
        }) ?? '{}'
      if (dataStr !== '{}') {
        channel({
          type: 'setAll',
          rid: data.rid,
          data: JSON.parse(dataStr),
        })
      }
    }
    if (data.type === 'setAll' && data.rid === pageRid && typeof data.data === 'object') {
      for (const key in data.data) {
        if (key.indexOf(shareName) === 0) window.sessionStorage.setItem(key, data.data[key])
      }
    }

    window.localStorage.removeItem(sessionShareChannelKey)
  })

  sessionShareStorage.getOtherPageStore()
  return sessionShareStorage
})()

export default sessionShareStorage
