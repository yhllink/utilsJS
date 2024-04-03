let map: WeakMap<Element, { setShow: (show: boolean) => void; once: boolean }>
let IntersectionObserver: IntersectionObserver

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

const observe = function (target: Element, setShow: (show: boolean) => void, once: boolean = true): void {
  if (!IntersectionObserver) init()
  map?.set?.(target, { setShow, once })
  IntersectionObserver?.observe?.(target)
}

const unobserve = function (target: Element): void {
  map?.delete?.(target)
  IntersectionObserver?.unobserve?.(target)
}

export default { init, observe, unobserve }
