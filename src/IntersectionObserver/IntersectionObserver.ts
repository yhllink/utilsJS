export default class OneIntersectionObserver {
  private map: Map<Element, { setShow: (show: boolean) => void; once: boolean }> = new Map()
  private IntersectionObserver: IntersectionObserver | null = null
  private threshold: number = 0.1

  constructor(threshold: number = 0.1) {
    this.threshold = threshold
  }

  private init() {
    this.IntersectionObserver = new window.IntersectionObserver(
      (entries) => {
        for (let i = 0, l = entries.length; i < l; i++) {
          const item = entries[i]

          // 当元素不在文档中时
          if (!item.target.isConnected) continue

          // 当元素不与视口相交时
          if (!item.isIntersecting) continue

          const targetHandle = this.map.get(item.target)

          // 当元素没有相关方法时
          if (!targetHandle) continue

          targetHandle.setShow(true)
          if (targetHandle.once) this.unobserve(item.target)
        }
      },
      { threshold: this.threshold }
    )
  }

  public observe(target: Element, setShow: (show: boolean) => void, once: boolean = true) {
    if (!this.IntersectionObserver) this.init()
    this.map.set(target, { setShow, once })
    this.IntersectionObserver?.observe?.(target)

    return () => this.unobserve(target)
  }

  public unobserve(target: Element) {
    this.map.delete(target)
    this.IntersectionObserver?.unobserve?.(target)
  }
}
