export default function getOffset(dom: HTMLElement) {
  const offset: {
    w?: number
    h?: number
    t?: number
    l?: number
  } = {}

  if (!dom) {
    console.error('$getOffset 未传入dom对象')
    return offset
  }

  offset.t = dom.offsetTop
  offset.l = dom.offsetLeft
  offset.h = dom.offsetHeight || dom.clientHeight
  offset.w = dom.offsetWidth || dom.clientWidth

  return offset
}
