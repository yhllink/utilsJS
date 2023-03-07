/**
 * 类 Vue 的 nextTick
 * @param func 回调函数
 */
function nextTick(func: Function) {
  if (typeof Promise !== 'undefined') {
    Promise.resolve().then(function () {
      func()
    })
  } else if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function () {
      func()
    })
    const textNode = document.createTextNode('0')
    observer.observe(textNode, { characterData: true })
    textNode.data = '1'
  } else {
    setTimeout(func, 0)
  }
}

export default nextTick
