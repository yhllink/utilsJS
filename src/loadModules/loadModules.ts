/**
 * $modules 加载模块
 * @param {Function} modulesFn Promise:加载模块函数(()=>import('yhl-explorer-js')
 * @param {Function} cb 加载完成回调
 */
export default function loadModules<P>(modulesFn: () => Promise<any>, cb?: (modules: P) => void): Promise<P> {
  return new Promise(async (resolve) => {
    try {
      const res = await modulesFn()
      const modules = res.default || res
      cb && cb(modules)
      resolve(modules)
    } catch (error) {}
  })
}
