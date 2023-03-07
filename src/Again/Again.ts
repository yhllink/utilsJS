/*
 * @Author: yaohanlin
 * @Date: 2021-01-26 18:17:00
 * @Last Modified by: yaohanlin
 * @Last Modified time: 2023-01-31 11:24:31
 */

interface StopData {
  code: -1 | 200 | 401 | 400
  message: string
  data?: any
}

class Again {
  private Fn: (index: number) => Promise<any>
  private count: number
  private $count: number
  private time: number
  private open: boolean
  private stopData: StopData

  /**
   * $again 循环直到正确结果或达到循环次数
   * @param {Function} Fn 循环函数，必须返回promise 并且resolve返回正确结果 reject返回错误结果
   * @param {Number} count 循环最大次数 -1 为无限循环
   * @param {Number} time 循环间隔时间
   */
  constructor(
    Fn: (index: number) => Promise<any>,
    count: number = 5,
    time: number = 50
  ) {
    this.Fn = Fn
    this.count = count
    this.$count = count
    this.time = time
    this.open = true
    this.stopData = { code: -1, message: '未开始' }
  }

  public restart: () => void = () => {
    this.count = this.$count
    this.start()
  }

  public stop: () => void = (
    data: StopData = { code: 401, message: '手动结束', data: {} }
  ) => {
    this.stopData = data
    this.open = false
  }

  /**
   * 开始执行
   * @returns
   */
  public start = () => {
    const fn: Promise<StopData> = new Promise((resolve) => {
      if (!this.open) {
        resolve(this.stopData)
        return
      }

      this.count--

      // 运行函数 获取返回值
      const res = this.Fn(this.$count - this.count)

      // 根据返回值判断是否是 Promise
      Promise.resolve(res)
        .then((res) => {
          if (!res) throw Error('$again 如传入函数，必须为Promise')
        })
        .catch(() => {})

      res
        // 如果结果正确
        .then((res: any) => {
          // 返回结果
          resolve({ code: 200, message: '循环结束', data: res })
        })

        // 如果结果不正确
        .catch(async (err: any) => {
          // 递归结束
          if (this.count == 0) {
            // 返回失败结果
            resolve({ code: 400, message: '循环结束', data: err })
            return
          }

          // 等待
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve({})
            }, this.time)
          })

          // 递归获取结果
          resolve(this.start())
        })
    })
    return fn
  }
}

export default Again
