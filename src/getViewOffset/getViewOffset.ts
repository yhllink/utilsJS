/**
 * 获取视口宽高
 *
 * 该函数用于计算并返回当前视口的宽度和高度
 * 由于历史原因，body和documentElement在某些情况下会返回不同的值，
 * 因此需要进行判断以确保获取正确的视口尺寸
 *
 * @returns {Object} 返回一个包含视口宽度和高度的对象 {w, h}
 */
export function getViewOffset() {
  // 获取body和documentElement对象
  const body = window.document.body
  const documentElement = window.document.documentElement

  // 初始化宽度为-1，用于后续计算
  let w = -1
  // 当body和documentElement的客户端宽度都存在时，取较小值
  if (body.clientWidth && documentElement.clientWidth) {
    w = body.clientWidth < documentElement.clientWidth ? body.clientWidth : documentElement.clientWidth
  } else {
    // 否则，取较大值
    w = body.clientWidth > documentElement.clientWidth ? body.clientWidth : documentElement.clientWidth
  }

  // 初始化高度为-1，用于后续计算
  let h = -1
  // 当body和documentElement的客户端高度都存在时，取较小值
  if (body.clientHeight && documentElement.clientHeight) {
    h = body.clientHeight < documentElement.clientHeight ? body.clientHeight : documentElement.clientHeight
  } else {
    // 否则，取较大值
    h = body.clientHeight > documentElement.clientHeight ? body.clientHeight : documentElement.clientHeight
  }

  // 返回计算得到的视口宽度和高度
  return { w, h }
}
