// 定义一个用于管理异步函数执行的类
export class OneAsyncFunctionManage {
  // 初始化状态，表示是否正在执行函数
  private status = false
  // 初始化一个函数列表，列表中的函数返回一个Promise
  private list: (() => Promise<any>)[] = []

  /**
   * 私有方法run，用于执行列表中的第一个函数
   * 如果当前状态为正在执行函数，则不进行任何操作
   * 否则，从列表中取出第一个函数，将其标记为正在执行，然后调用该函数
   * 在函数执行完成后，无论结果如何，将状态标记为非执行状态，并再次调用run方法
   */
  private run() {
    if (this.status) return

    const fn = this.list.shift()
    if (fn) {
      this.status = true
      fn().finally(() => {
        this.status = false
        this.run()
      })
    }
  }

  /**
   * 公共方法add，用于向函数列表中添加一个新的异步函数，并尝试执行列表中的函数
   * @param fn 要添加的异步函数，该函数返回一个Promise
   */
  public add(fn: () => Promise<any>) {
    this.list.push(fn)
    this.run()
  }
}
