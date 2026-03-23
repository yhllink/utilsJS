import { PubSub } from '@/PubSub/PubSub'

describe('PubSub 模块测试', () => {
  beforeEach(() => {
    // 清空所有事件
    PubSub.unsubscribe('test')
  })

  // ==================== 订阅功能测试 ====================
  describe('订阅功能', () => {
    it('应该能订阅事件', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      // 订阅后不应该立即调用
      expect(callback).not.toHaveBeenCalled()
    })

    it('应该能订阅多个回调', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      PubSub.subscribe('test', callback1)
      PubSub.subscribe('test', callback2)
      
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).not.toHaveBeenCalled()
    })

    it('应该返回取消订阅的函数', () => {
      const callback = jest.fn()
      const unsubscribe = PubSub.subscribe('test', callback)
      
      expect(unsubscribe).toBeDefined()
      expect(typeof unsubscribe).toBe('function')
    })

    it('应该能订阅不同事件', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      PubSub.subscribe('event1', callback1)
      PubSub.subscribe('event2', callback2)
      
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).not.toHaveBeenCalled()
    })
  })

  // ==================== 发布功能测试 ====================
  describe('发布功能', () => {
    it('应该能发布事件并调用回调', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      PubSub.publish('test', { data: 'test' })
      
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith({ data: 'test' })
    })

    it('应该能发布多次事件', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      PubSub.publish('test', 'data1')
      PubSub.publish('test', 'data2')
      PubSub.publish('test', 'data3')
      
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenNthCalledWith(1, 'data1')
      expect(callback).toHaveBeenNthCalledWith(2, 'data2')
      expect(callback).toHaveBeenNthCalledWith(3, 'data3')
    })

    it('应该能发布给多个订阅者', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      PubSub.subscribe('test', callback1)
      PubSub.subscribe('test', callback2)
      
      PubSub.publish('test', 'data')
      
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback1).toHaveBeenCalledWith('data')
      expect(callback2).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledWith('data')
    })

    it('发布不存在的事件不应该报错', () => {
      expect(() => {
        PubSub.publish('nonexistent', 'data')
      }).not.toThrow()
    })

    it('应该能发布 null 和 undefined', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      PubSub.publish('test', null)
      PubSub.publish('test', undefined)
      
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, null)
      expect(callback).toHaveBeenNthCalledWith(2, undefined)
    })
  })

  // ==================== once 功能测试 ====================
  describe('once 功能', () => {
    it('应该能订阅仅触发一次的事件', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback, true)
      
      PubSub.publish('test', 'data1')
      PubSub.publish('test', 'data2')
      
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith('data1')
    })

    it('once 订阅后应该自动取消', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback, true)
      
      PubSub.publish('test', 'data1')
      PubSub.publish('test', 'data2')
      PubSub.publish('test', 'data3')
      
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('混合 once 和普通订阅', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      PubSub.subscribe('test', callback1, true) // once
      PubSub.subscribe('test', callback2, false) // 普通
      
      PubSub.publish('test', 'data1')
      PubSub.publish('test', 'data2')
      
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(2)
    })
  })

  // ==================== 取消订阅测试 ====================
  describe('取消订阅功能', () => {
    it('应该能通过返回的函数取消订阅', () => {
      const callback = jest.fn()
      const unsubscribe = PubSub.subscribe('test', callback)
      
      unsubscribe()
      
      PubSub.publish('test', 'data')
      
      expect(callback).not.toHaveBeenCalled()
    })

    it('应该能直接调用 unsubscribe 取消订阅', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      PubSub.unsubscribe('test', callback)
      
      PubSub.publish('test', 'data')
      
      expect(callback).not.toHaveBeenCalled()
    })

    it('取消不存在的订阅不应该报错', () => {
      const callback = jest.fn()
      expect(() => {
        PubSub.unsubscribe('nonexistent', callback)
      }).not.toThrow()
    })

    it('重复取消订阅不应该报错', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      expect(() => {
        PubSub.unsubscribe('test', callback)
        PubSub.unsubscribe('test', callback)
      }).not.toThrow()
    })

    it('取消部分订阅', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      PubSub.subscribe('test', callback1)
      PubSub.subscribe('test', callback2)
      
      PubSub.unsubscribe('test', callback1)
      
      PubSub.publish('test', 'data')
      
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('取消所有订阅后事件应该被删除', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      PubSub.subscribe('test', callback1)
      PubSub.subscribe('test', callback2)
      
      PubSub.unsubscribe('test', callback1)
      PubSub.unsubscribe('test', callback2)
      
      PubSub.publish('test', 'data')
      
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).not.toHaveBeenCalled()
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理空字符串事件名', () => {
      const callback = jest.fn()
      PubSub.subscribe('', callback)
      PubSub.publish('', 'data')
      
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('应该能处理特殊字符事件名', () => {
      const callback = jest.fn()
      const eventName = 'test!@#$%^&*()_+'
      
      PubSub.subscribe(eventName, callback)
      PubSub.publish(eventName, 'data')
      
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('应该能处理数字事件名', () => {
      const callback = jest.fn()
      // @ts-ignore - 测试数字事件名
      PubSub.subscribe(123, callback)
      // @ts-ignore
      PubSub.publish(123, 'data')
      
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('应该能处理对象事件名', () => {
      const callback = jest.fn()
      const eventName = { id: 'test' }
      
      // @ts-ignore - 测试对象事件名
      PubSub.subscribe(eventName, callback)
      // @ts-ignore
      PubSub.publish(eventName, 'data')
      
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  // ==================== 数据传递测试 ====================
  describe('数据传递', () => {
    it('应该能传递对象数据', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      const data = { id: 1, name: 'test' }
      PubSub.publish('test', data)
      
      expect(callback).toHaveBeenCalledWith(data)
      expect(callback).toHaveBeenCalledWith({ id: 1, name: 'test' })
    })

    it('应该能传递数组数据', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      const data = [1, 2, 3]
      PubSub.publish('test', data)
      
      expect(callback).toHaveBeenCalledWith([1, 2, 3])
    })

    it('应该能传递函数数据', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      const fn = () => 'test'
      PubSub.publish('test', fn)
      
      expect(callback).toHaveBeenCalledWith(fn)
    })

    it('应该能传递嵌套数据', () => {
      const callback = jest.fn()
      PubSub.subscribe('test', callback)
      
      const data = {
        user: {
          profile: {
            name: 'John',
            tags: ['a', 'b'],
          },
        },
      }
      
      PubSub.publish('test', data)
      
      expect(callback).toHaveBeenCalledWith(data)
    })
  })

  // ==================== 执行顺序测试 ====================
  describe('执行顺序', () => {
    it('应该按订阅顺序调用回调', () => {
      const calls: string[] = []
      
      PubSub.subscribe('test', () => calls.push('1'))
      PubSub.subscribe('test', () => calls.push('2'))
      PubSub.subscribe('test', () => calls.push('3'))
      
      PubSub.publish('test', null)
      
      expect(calls).toEqual(['1', '2', '3'])
    })

    it('once 回调移除后不应该影响其他回调', () => {
      const calls: string[] = []
      
      PubSub.subscribe('test', () => calls.push('1'), true)
      PubSub.subscribe('test', () => calls.push('2'))
      PubSub.subscribe('test', () => calls.push('3'), true)
      
      PubSub.publish('test', null)
      PubSub.publish('test', null)
      
      expect(calls).toEqual(['1', '2', '3', '2'])
    })
  })
})
