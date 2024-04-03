let map: WeakMap<Element, { setShow: (show: boolean) => void; once: boolean }>
let IntersectionObserver: IntersectionObserver

/**
 * 初始化
 */
const init = function () {
  map = new WeakMap()
  IntersectionObserver = new window.IntersectionObserver(
    (entries) => {
      for (let i = 0, l = entries.length; i < l; i++) {
        const item = entries[i]
        if (!item.target.isConnected) {
          unobserve(item.target)
          continue
        }

        if (!item.isIntersecting) continue

        const { setShow, once } = map?.get(item.target) || {}
        setShow?.(true)
        if (once) unobserve(item.target)
      }
    },
    { threshold: 0.1 }
  )
}

/**
 * 开启监听
 * @param {Element} target 监听元素
 * @param {(show: boolean) => void} setShow 回调函数，用于设置显示状态
 * @param {boolean} once 是否只监听一次，监听一次后自动移除监听
 */
const observe = function (target: Element, setShow: (show: boolean) => void, once: boolean = true): void {
  if (!IntersectionObserver) init()
  map?.set?.(target, { setShow, once })
  IntersectionObserver?.observe?.(target)
}

/**
 * 停止监听
 * @param target 被监听的元素
 */
const unobserve = function (target: Element): void {
  map?.delete?.(target)
  IntersectionObserver?.unobserve?.(target)
}

export default { init, observe, unobserve }
