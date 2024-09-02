import { isServer } from '@/isServer/isServer'

/**
 * 动态加载JavaScript文件
 *
 * 此函数用于在运行时动态加载JavaScript文件到页面中它支持同步、异步和延迟加载方式
 * 在页面加载完成后，通常用于按需加载额外的JavaScript库或脚本
 *
 * @param {{id: string, src: string, load?: 'default' | 'defer' | 'async'}} param 配置项
 *   - id: 脚本标签的唯一标识符
 *   - src: 要加载的JavaScript文件的URL
 *   - load: (可选) 加载方式，可以是'default'、'defer'或'async'，分别表示同步、延迟和异步加载，默认为'async'
 * @returns {Promise<boolean>} 返回一个Promise，解析为true表示加载成功，false表示加载失败
 */
export async function loadScript({ id, src, load = 'async' }: { src: string; load?: 'default' | 'defer' | 'async'; id: string }) {
  // 如果在服务器端运行，则不加载脚本
  if (isServer) return false

  // 如果脚本已经加载，则直接返回成功
  if (window.document.querySelector('#' + id)) return true

  // 创建一个Promise，用于处理脚本的加载状态
  return new Promise((resolve) => {
    // 延迟600毫秒后执行脚本加载，以确保页面的其他加载任务已完成
    setTimeout(() => {
      const script = window.document.createElement('script')
      script.id = id
      // 根据load参数设置脚本的加载方式
      if (load === 'defer') script.setAttribute('defer', '')
      if (load === 'async') script.setAttribute('async', '')
      // 设置脚本加载成功时的回调
      script.onload = function () {
        resolve(true)
      }
      // 设置脚本加载失败时的回调
      script.onerror = function () {
        resolve(false)
      }
      script.src = src

      // 将脚本添加到页面中
      window.document.body.appendChild(script)
    }, 600)
  })
}
