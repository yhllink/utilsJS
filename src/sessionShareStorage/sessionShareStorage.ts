import isServer from '../isServer/isServer'

const sessionShareStorage: {
  setItem: Storage['setItem']
  getItem: Storage['getItem']
  removeItem: Storage['removeItem']
  clear: Storage['clear']
  key: Storage['key']
  length: () => Storage['length']
} = (function () {
  if (isServer) {
    return Object.freeze({
      key: (index: number) => '',
      getItem: (key: string) => '',
      length: () => 0,
      setItem(key: string, value: string) {},
      removeItem(key: string) {},
      clear() {},
    })
  }

  const pageRid = 'rid-' + Math.floor(Math.random() * 100000000)
  const channel = new BroadcastChannel('sessionShareStorage')

  const sessionShareStorage = Object.freeze({
    key(index: number) {
      return window.sessionStorage.key(index)
    },
    getItem(key: string) {
      return window.sessionStorage.getItem(key)
    },
    length() {
      return window.sessionStorage.length
    },

    setItem(key: string, value: string) {
      channel.postMessage({ type: 'setItem', key: key, value: value })
      return window.sessionStorage.setItem(key, value)
    },
    removeItem(key: string) {
      channel.postMessage({ type: 'removeItem', key: key })
      return window.sessionStorage.removeItem(key)
    },
    clear() {
      channel.postMessage({ type: 'clear' })
      return window.sessionStorage.clear()
    },
  })

  channel.onmessage = function (e) {
    const data = e.data

    if (data?.type === 'setItem') window.sessionStorage.setItem(data.key, data.value)
    if (data?.type === 'removeItem') window.sessionStorage.removeItem(data.key)
    if (data?.type === 'clear') window.sessionStorage.clear()

    if (data?.type === 'getAll') channel.postMessage({ type: 'setAll', rid: data.rid, data: JSON.parse(JSON.stringify(window.sessionStorage)) })
    if (data?.type === 'setAll' && data.rid === pageRid) {
      for (const key in data.data) window.sessionStorage.setItem(key, data.data[key])
    }
  }

  window.addEventListener(
    'load',
    function () {
      channel.postMessage({ type: 'getAll', rid: pageRid })
    },
    { once: true }
  )

  return sessionShareStorage
})()

export default sessionShareStorage
