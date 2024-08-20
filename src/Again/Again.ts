// 定义停止操作的数据接口
interface StopData {
  code: -1 | 200 | 401 | 400 // 操作结果代码
  message: string // 操作结果消息
  data?: any // 操作附加数据（可选）
}

/**
 * Again类，用于循环执行直到获得正确结果或达到循环次数
 */
class Again {
  private Fn: (index: number) => Promise<any> // 循环执行的函数
  private count: number // 剩余循环次数
  private $count: number // 总循环次数
  private time: number // 循环间隔时间
  private open: boolean // 是否继续执行
  private stopData: StopData // 停止操作时的数据

  /**
   * 构造函数，初始化循环条件
   * @param {Function} Fn 循环函数，必须返回promise，并且resolve返回正确结果，reject返回错误结果
   * @param {Number} count 循环最大次数，-1 为无限循环
   * @param {Number} time 循环间隔时间
   */
  constructor(Fn: (index: number) => Promise<any>, count: number = 5, time: number = 50) {
    this.Fn = Fn
    this.count = count
    this.$count = count
    this.time = time
    this.open = true
    this.stopData = { code: -1, message: '未开始' }
  }

  /**
   * 重新开始执行循环
   */
  public restart: () => void = () => {
    this.count = this.$count // 重置循环次数
    this.start() // 开始执行
  }

  /**
   * 停止执行循环
   * @param data 停止执行时的数据
   */
  public stop: (data: StopData) => void = (data: StopData = { code: 401, message: '手动结束', data: {} }) => {
    this.stopData = data // 记录停止数据
    this.open = false // 停止执行
  }

  /**
   * 开始执行循环
   * @returns {Promise<StopData>} 执行结果的Promise
   */
  public start = (): Promise<StopData> => {
    return new Promise((resolve) => {
      if (!this.open) {
        resolve(this.stopData)
        return
      }

      this.count-- // 循环次数减一

      // 运行函数获取返回值
      const res = this.Fn(this.$count - this.count)

      // 确保返回值为Promise
      Promise.resolve(res)
        .then((res) => {
          if (!res) throw Error('$again 传入函数必须返回Promise')
        })
        .catch(() => {})

      res
        // 如果结果正确
        .then((res: any) => {
          resolve({ code: 200, message: '循环结束', data: res }) // 返回成功结果
        })

        // 如果结果不正确
        .catch(async (err: any) => {
          // 达到循环次数限制
          if (this.count === 0) {
            resolve({ code: 400, message: '循环次数已达上限', data: err }) // 返回失败结果
            return
          }

          // 等待设定的间隔时间
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve({})
            }, this.time)
          })

          // 递归继续执行循环
          resolve(this.start())
        })
    })
  }
}

export default Again
