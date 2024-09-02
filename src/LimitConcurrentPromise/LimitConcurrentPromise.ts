// 定义一个默认类，用于限制并发Promise的数量
export class LimitConcurrentPromise {
  // 定义一个列表，用于存储待执行的Promise任务
  private list: {
    promiseFn: Function
    options: any
    resolve: any
    reject: any
  }[] = []
  // 定义当前正在执行的Promise数量
  private limit: number = 0
  // 定义允许的最大并发Promise数量
  private maxLimit: number

  // 构造函数，初始化最大并发数量
  constructor(limit: number) {
    this.maxLimit = limit
  }

  // 私有方法，用于执行列表中的下一个Promise任务
  private run() {
    // 从列表中取出第一个任务
    const item = this.list.shift()
    // 如果列表为空或者已经达到最大并发数量，则不执行新的任务
    if (!item || this.limit >= this.maxLimit) return

    // 正在执行的任务数量加一
    this.limit++
    // 解构取出任务的函数、参数以及resolve和reject方法
    const { promiseFn, options, resolve, reject } = item
    // 将参数转换为数组形式，以便支持多个参数
    const endOptions = Array.isArray(options) ? options : [options]

    // 执行Promise函数，并处理结果或错误
    promiseFn(...endOptions)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        // 任务完成后，正在执行的任务数量减一，并尝试执行下一个任务
        this.limit--
        this.run()
      })
  }

  // 公共方法，用于向列表中添加新的Promise任务
  public add(promiseFn: Function, options: any) {
    // 返回一个新的Promise，以便调用者可以使用then/catch等方法
    return new Promise((resolve, reject) => {
      // 将新的任务添加到列表中
      this.list.push({
        promiseFn,
        options,
        resolve,
        reject,
      })
      // 尝试执行列表中的任务
      this.run()
    })
  }
}
