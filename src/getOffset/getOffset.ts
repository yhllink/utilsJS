/**
 * 获取DOM元素的偏移量
 * 此函数用于计算DOM元素的位置，包括上边距、左边距、宽度和高度
 * 它首先检查是否传递了有效的DOM对象，然后使用不同的方法获取元素的偏移量
 *
 * @param dom 要获取偏移量的DOM元素
 * @returns 返回一个包含元素上边距、左边距、宽度和高度的对象
 */
export function getOffset(dom: HTMLElement) {
  // 初始化偏移量对象，用于存储计算结果
  const offset: { w?: number; h?: number; t?: number; l?: number } = {}

  // 检查是否传入了DOM对象，如果没有，则打印错误并返回空的偏移量对象
  if (!dom) {
    console.error('$getOffset 未传入dom对象')
    return offset
  }

  // 如果DOM对象有getBoundingClientRect方法，则使用该方法获取偏移量
  if (!!dom.getBoundingClientRect) {
    const rect = dom.getBoundingClientRect()
    offset.t = rect.top
    offset.l = rect.left
    offset.w = rect.width
    offset.h = rect.height
    return offset
  }

  // 如果DOM对象没有getBoundingClientRect方法，则使用offsetTop、offsetLeft等属性获取偏移量
  offset.t = dom.offsetTop
  offset.l = dom.offsetLeft
  offset.h = dom.offsetHeight || dom.clientHeight
  offset.w = dom.offsetWidth || dom.clientWidth

  return offset
}
