/**
 * 加载模块
 * 
 * 本函数通过动态导入（Promise）的方式加载模块，提供了一个灵活的模块加载机制。
 * 它允许异步加载模块，并在模块加载完成后执行回调函数，提高了代码的模块化和可维护性。
 * 
 * @param {() => Promise<any>} modulesFn 一个返回 Promise 的函数，用于加载模块（例如动态导入模块） eg. loadModules(()=>import('yhl-explorer-js'))
 * @param {(modules: P) => void} cb 模块加载完成后的回调函数，接收加载的模块作为参数
 * @returns {Promise<P>} 返回一个 Promise，Promise 解析后的值为加载的模块
 */
export default function loadModules<P>(modulesFn: () => Promise<any>, cb?: (modules: P) => void): Promise<P> {
  return new Promise(async (resolve) => {
    try {
      // 执行模块加载函数，等待模块加载完成
      const res = await modulesFn()
      // 获取模块的默认导出或全部导出
      const modules = res.default || res
      // 如果存在回调函数，则执行回调函数，传递模块作为参数
      cb && cb(modules)
      // 解析 Promise，返回加载的模块
      resolve(modules)
    } catch (error) {
      // 错误处理：在加载过程中发生错误时，当前实现中没有具体的错误处理逻辑
    }
  })
}