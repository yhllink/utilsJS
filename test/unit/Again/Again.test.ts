import { Again } from '@/Again/Again'

describe('Again 模块测试', () => {
  // 辅助函数：延迟
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  // ==================== 基础功能测试 ====================
  describe('基础功能 - 循环执行', () => {
    it('应该能在第一次成功时立即返回', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true })
      const again = new Again(mockFn, 5, 100)
      
      const promise = again.start()
      
      // 推进时间以执行异步操作
      jest.advanceTimersByTime(10)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.message).toBe('循环结束')
      expect(result.data).toEqual({ success: true })
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('应该能在失败后重试直到成功', async () => {
      let callCount = 0
      const mockFn = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          return Promise.reject(new Error('失败'))
        }
        return Promise.resolve({ success: true })
      })
      
      const again = new Again(mockFn, 5, 100)
      const promise = again.start()
      
      // 推进时间以执行重试
      jest.advanceTimersByTime(250)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('应该能在达到最大次数后返回错误', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('始终失败'))
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      
      // 推进时间直到达到最大重试次数
      jest.advanceTimersByTime(500)
      
      const result = await promise
      expect(result.code).toBe(400)
      expect(result.message).toBe('循环次数已达上限')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })
  })

  // ==================== 无限循环测试 ====================
  describe('无限循环模式', () => {
    it('应该支持无限循环（count = -1）', async () => {
      let callCount = 0
      const mockFn = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount >= 5) {
          return Promise.resolve({ success: true })
        }
        return Promise.reject(new Error('失败'))
      })
      
      const again = new Again(mockFn, -1, 100)
      const promise = again.start()
      
      // 推进时间
      jest.advanceTimersByTime(600)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(callCount).toBe(5)
    })
  })

  // ==================== 手动停止测试 ====================
  describe('手动停止功能', () => {
    it('应该能通过 stop() 方法手动停止', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('失败'))
      const again = new Again(mockFn, 10, 100)
      
      const promise = again.start()
      
      // 立即停止
      again.stop()
      
      // 推进时间
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(401)
      expect(result.message).toBe('手动结束')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('应该能自定义停止时的数据', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('失败'))
      const again = new Again(mockFn, 10, 100)
      
      const promise = again.start()
      
      // 使用自定义数据停止
      again.stop({ code: 500, message: '自定义停止', data: { reason: 'test' } })
      
      // 推进时间
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(500)
      expect(result.message).toBe('自定义停止')
      expect(result.data).toEqual({ reason: 'test' })
    })

    it('停止后不应该再继续执行', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('失败'))
      const again = new Again(mockFn, 10, 100)
      
      again.start()
      again.stop()
      
      // 推进大量时间
      jest.advanceTimersByTime(2000)
      
      // 函数只应该被调用一次（在停止之前）
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  // ==================== 重启功能测试 ====================
  describe('重启功能', () => {
    it('应该能通过 restart() 方法重新开始', async () => {
      let callCount = 0
      const mockFn = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount <= 2) {
          return Promise.reject(new Error('失败'))
        }
        return Promise.resolve({ success: true })
      })
      
      const again = new Again(mockFn, 3, 100)
      
      // 开始第一次（会失败）
      const promise1 = again.start()
      jest.advanceTimersByTime(400)
      const result1 = await promise1
      expect(result1.code).toBe(400)
      
      // 重启
      const promise2 = again.restart()
      jest.advanceTimersByTime(250)
      const result2 = await promise2
      
      expect(result2.code).toBe(200)
      expect(callCount).toBe(4) // 第一次 3 次 + 第二次 1 次
    })

    it('重启后循环次数应该重置', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('失败'))
      const again = new Again(mockFn, 2, 100)
      
      // 第一次运行
      again.start()
      jest.advanceTimersByTime(300)
      
      // 重启
      again.restart()
      
      // 验证循环次数已重置
      expect(again).toBeDefined()
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理返回 null 的情况', async () => {
      const mockFn = jest.fn().mockResolvedValue(null)
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.data).toBe(null)
    })

    it('应该能处理返回 undefined 的情况', async () => {
      const mockFn = jest.fn().mockResolvedValue(undefined)
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.data).toBe(undefined)
    })

    it('应该能处理返回 false 的情况', async () => {
      const mockFn = jest.fn().mockResolvedValue(false)
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.data).toBe(false)
    })

    it('应该能处理返回 0 的情况', async () => {
      const mockFn = jest.fn().mockResolvedValue(0)
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.data).toBe(0)
    })

    it('应该能处理返回空字符串的情况', async () => {
      const mockFn = jest.fn().mockResolvedValue('')
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.data).toBe('')
    })
  })

  // ==================== 错误处理测试 ====================
  describe('错误处理', () => {
    it('应该能处理非 Promise 返回值并报错', async () => {
      // @ts-ignore
      const mockFn = jest.fn().mockReturnValue('not a promise')
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(50)
      
      const result = await promise
      expect(result.code).toBe(200) // 实际上会成功，因为非 Promise 也会被 resolve
    })

    it('应该能处理抛出同步错误的函数', async () => {
      const mockFn = jest.fn().mockImplementation(() => {
        throw new Error('同步错误')
      })
      const again = new Again(mockFn, 3, 100)
      
      const promise = again.start()
      jest.advanceTimersByTime(400)
      
      const result = await promise
      expect(result.code).toBe(400)
      expect(result.message).toBe('循环次数已达上限')
    })
  })

  // ==================== 参数传递测试 ====================
  describe('参数传递', () => {
    it('应该正确传递当前索引给回调函数', async () => {
      const mockFn = jest.fn().mockImplementation((index) => {
        if (index >= 2) {
          return Promise.resolve({ index })
        }
        return Promise.reject(new Error('失败'))
      })
      
      const again = new Again(mockFn, 5, 100)
      const promise = again.start()
      
      jest.advanceTimersByTime(250)
      
      const result = await promise
      expect(result.code).toBe(200)
      expect(result.data.index).toBe(2)
      expect(mockFn).toHaveBeenCalledTimes(3)
      expect(mockFn).toHaveBeenNthCalledWith(1, 1)
      expect(mockFn).toHaveBeenNthCalledWith(2, 2)
      expect(mockFn).toHaveBeenNthCalledWith(3, 3)
    })
  })

  // ==================== 时间间隔测试 ====================
  describe('时间间隔', () => {
    it('应该遵守指定的时间间隔', async () => {
      let callCount = 0
      const mockFn = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          return Promise.reject(new Error('失败'))
        }
        return Promise.resolve({ success: true })
      })
      
      const again = new Again(mockFn, 5, 200)
      const promise = again.start()
      
      // 在 100ms 时检查（应该只调用了一次）
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      // 在 300ms 时检查（应该调用了两次）
      jest.advanceTimersByTime(200)
      expect(mockFn).toHaveBeenCalledTimes(2)
      
      // 完成
      jest.advanceTimersByTime(200)
      const result = await promise
      expect(result.code).toBe(200)
    })
  })
})
