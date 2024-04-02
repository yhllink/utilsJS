import isServer from '../isServer/isServer'

async function loadScript({ id, src, load = 'async' }: { src: string; load?: 'default' | 'defer' | 'async'; id: string }) {
  if (isServer) return false

  if (window.document.querySelector('#' + id)) return true

  return new Promise((resolve) => {
    setTimeout(() => {
      const script = window.document.createElement('script')
      script.id = id
      if (load === 'defer') script.setAttribute('defer', '')
      if (load === 'async') script.setAttribute('async', '')
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
