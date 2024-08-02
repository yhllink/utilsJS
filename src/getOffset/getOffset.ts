/**
 * 获取元素相对于视窗的偏移量
 * @param {HTMLElement} dom 元素
 * @returns {Object} 返回一个对象，包含top、left、width、height
 */
export default function getOffset(dom: HTMLElement) {
  const offset: { w?: number; h?: number; t?: number; l?: number } = {}

  if (!dom) {
    console.error('$getOffset 未传入dom对象')
    return offset
  }

  if (!!dom.getBoundingClientRect) {
    const rect = dom.getBoundingClientRect()
    offset.t = rect.top
    offset.l = rect.left
  } else {
    offset.t = dom.offsetTop
    offset.l = dom.offsetLeft
  }

  offset.h = dom.offsetHeight || dom.clientHeight
  offset.w = dom.offsetWidth || dom.clientWidth

  return offset
}
