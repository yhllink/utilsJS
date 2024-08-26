type OptionType<P> = {
  cb?: (modules: P) => void
  modules?: string | false
}

/**
 * 加载模块
 * 本函数通过动态导入（Promise）的方式加载模块，提供了一个灵活的模块加载机制。
 * 它允许异步加载模块，并在模块加载完成后执行回调函数，提高了代码的模块化和可维护性。
 */
function loadModules<P = any>(modulesFn: () => Promise<any>, option?: OptionType<P>): Promise<P>
function loadModules<P = any>(modulesFn: () => Promise<any>, option?: OptionType<P>['cb']): Promise<P>
function loadModules<P = any>(modulesFn: () => Promise<any>, option?: OptionType<P> | OptionType<P>['cb']): Promise<P> {
  const { cb, modules = 'default' } = (typeof option === 'function' ? { cb: option } : option) || {}

  return modulesFn()
    .then((res) => (modules ? res[modules] : res))
    .then((modules) => {
      cb && cb(modules)
      return modules
    })
    .catch(() => {})
}

export default loadModules
