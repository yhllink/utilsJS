/**
 * 获取视口宽高
 * @returns {Object} {w, h}
 */
export default function getViewOffset() {
  const body = window.document.body
  const documentElement = window.document.documentElement

  let w = -1
  if (body.clientWidth && documentElement.clientWidth) {
    w = body.clientWidth < documentElement.clientWidth ? body.clientWidth : documentElement.clientWidth
  } else {
    w = body.clientWidth > documentElement.clientWidth ? body.clientWidth : documentElement.clientWidth
  }

  let h = -1
  if (body.clientHeight && documentElement.clientHeight) {
    h = body.clientHeight < documentElement.clientHeight ? body.clientHeight : documentElement.clientHeight
  } else {
    h = body.clientHeight > documentElement.clientHeight ? body.clientHeight : documentElement.clientHeight
  }

  return { w, h }
}
