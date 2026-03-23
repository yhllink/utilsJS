// 定义停止操作的数据接口
interface StopData {
  code: -1 | 200 | 401 | 400 // 操作结果代码
  message: string // 操作结果消息
  data?: any // 操作附加数据（可选）
}

/**
 * Again类，用于循环执行直到获得正确结果或达到循环次数
 */
export class Again {
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
   * @returns {Promise<StopData>} 执行结果的 Promise
   * 
   * @example
   * // 基本用法
   * const again = new Again(async (index) => {
   *   const result = await fetch('/api/data')
   *   return result
   * }, 5, 100)
   * const res = await again.start()
   * console.log(res.code) // 200 或 400
   * 
   * @example
   * // 手动停止
   * const again = new Again(async (index) => {
   *   return await fetchData()
   * }, 5, 100)
   * again.start()
   * setTimeout(() => again.stop(), 1000)
   */
  public start = (): Promise<StopData> => {
    return new Promise(async (resolve) => {
      // 迭代实现，消除递归调用栈溢出风险
      while (this.open && this.count !== 0) {
        this.count--
        
        try {
          const res = await this.Fn(this.$count - this.count)
          if (!res) throw new Error('$again 传入函数必须返回 Promise')
          
          resolve({ code: 200, message: '循环结束', data: res })
          return
        } catch (err) {
          // 达到循环次数限制
          if (this.count === 0) {
            resolve({ code: 400, message: '循环次数已达上限', data: err })
            return
          }
          
          // 等待间隔时间
          await new Promise(r => setTimeout(r, this.time))
        }
      }
      
      resolve(this.stopData)
    })
  }
}
