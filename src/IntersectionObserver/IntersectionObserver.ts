/**
 * `OneIntersectionObserver`类用于观察元素与浏览器视口的交集情况
 * 当元素与视口发生交集时，会调用回调函数`setShow`来通知调用者
 * 支持一次性观察和重复观察两种模式
 */
export default class OneIntersectionObserver {
  // 存储被观察元素及其回调函数和是否只观察一次的标志
  private map: Map<Element, { setShow: (show: boolean) => void; once: boolean }> = new Map()
  // `IntersectionObserver`实例，用于实际的交集观察
  private IntersectionObserver: IntersectionObserver | null = null
  // 观察的阈值，默认为0.1，即当元素露出10%时触发回调
  private threshold: number = 0.1

  /**
   * 构造函数，初始化观察的阈值
   * @param threshold 交集观察的阈值，默认为0.1
   */
  constructor(threshold: number = 0.1) {
    this.threshold = threshold
  }

  /**
   * 初始化`IntersectionObserver`实例
   * 只有在尚未初始化的情况下才会创建新的`IntersectionObserver`实例
   */
  private init() {
    this.IntersectionObserver = new window.IntersectionObserver(
      (entries) => {
        for (let i = 0, l = entries.length; i < l; i++) {
          const item = entries[i]

          // 当元素不在文档中时，跳过
          if (!item.target.isConnected) continue

          // 当元素不与视口相交时，跳过
          if (!item.isIntersecting) continue

          const targetHandle = this.map.get(item.target)

          // 当元素没有相关方法时，跳过
          if (!targetHandle) continue

          // 设置元素为可见状态
          targetHandle.setShow(true)
          // 如果是只观察一次，则移除对该元素的观察
          if (targetHandle.once) this.unobserve(item.target)
        }
      },
      { threshold: this.threshold }
    )
  }

  /**
   * 开始观察指定元素
   * @param target 要观察的元素
   * @param setShow 当元素与视口交集时调用的回调函数，通知元素可见
   * @param once 是否只观察一次，默认为true
   * @returns 返回一个函数，该函数可用于停止观察
   */
  public observe(target: Element, setShow: (show: boolean) => void, once: boolean = true) {
    if (!this.IntersectionObserver) this.init()
    this.map.set(target, { setShow, once })
    this.IntersectionObserver?.observe?.(target)

    return () => this.unobserve(target)
  }

  /**
   * 停止观察指定元素
   * @param target 要停止观察的元素
   */
  public unobserve(target: Element) {
    this.map.delete(target)
    this.IntersectionObserver?.unobserve?.(target)
    if (this.map.size === 0) {
      this.IntersectionObserver?.disconnect?.()
      this.IntersectionObserver = null
    }
  }
}
