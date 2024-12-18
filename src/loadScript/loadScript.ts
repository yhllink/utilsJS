/**
 * 动态加载JavaScript文件
 *
 * 此函数用于在运行时动态加载JavaScript文件到页面中。它支持同步、异步和延迟加载方式，
 * 在页面加载完成后，通常用于按需加载额外的JavaScript库或脚本。
 *
 * @param {{id: string, src: string, load?: 'default' | 'defer' | 'async', time?: number}} param 配置项
 *   - id: 脚本标签的唯一标识符
 *   - src: 要加载的JavaScript文件的URL
 *   - load: (可选) 加载方式，可以是'default'、'defer'或'async'，分别表示同步、延迟和异步加载，默认为'async'
 *   - time: (可选) 延迟执行脚本加载的时间，单位毫秒，默认为100ms
 * @returns {Promise<boolean>} 返回一个Promise，解析为true表示加载成功，false表示加载失败
 */
export async function loadScript({ id, src, load = 'async', time = 100 }: { src: string; load?: 'default' | 'defer' | 'async'; id: string; time?: number }): Promise<boolean> {
  // 创建一个Promise，用于处理脚本的加载状态
  return new Promise((resolve) => {
    // 检查是否已经存在相同ID的脚本元素，如果存在则认为该脚本已加载，直接返回成功
    if (window.document.querySelector('#' + id)) return resolve(true)

    // 如果设置了延迟时间，则等待指定的时间后才开始加载脚本
    setTimeout(() => {
      const script = window.document.createElement('script')
      script.id = id

      // 根据提供的load参数设置脚本的加载行为
      switch (load) {
        case 'defer':
          script.setAttribute('defer', '')
          break
        case 'async':
          script.setAttribute('async', '')
          break
        default:
          // 默认情况下不做特殊处理，即同步加载
          break
      }

      // 当脚本成功加载时触发
      script.onload = function () {
        resolve(true)
      }

      // 当脚本加载失败时触发
      script.onerror = function () {
        resolve(false)
      }

      // 设置要加载的脚本的源地址
      script.src = src

      // 将创建的<script>元素添加到文档的<body>中，从而启动脚本加载过程
      window.document.body.appendChild(script)
    }, time) // 延迟执行脚本加载的时间
  })
}
