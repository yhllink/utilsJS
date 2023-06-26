import isServer from '../isServer/isServer'

async function loadScript(src: string, id: string) {
  if (isServer) return false

  if (window.document.querySelector('#' + id)) return true

  return new Promise((resolve) => {
    setTimeout(() => {
      const script = window.document.createElement('script')
      script.id = id
      script.onload = function () {
        resolve(true)
      }
      script.onerror = function () {
        resolve(false)
      }
      script.src = src

      window.document.body.appendChild(script)
    }, 600)
  })
}
export default loadScript
