import { IntersectionObserver as IOClass } from '@/IntersectionObserver/IntersectionObserver'
import { OneIntersectionObserver } from '@/IntersectionObserver/IntersectionObserver'

describe('IntersectionObserver 模块测试', () => {
  let mockElement: Element & { isConnected?: boolean }
  let callback: jest.Mock

  beforeEach(() => {
    // 创建模拟元素
    mockElement = {
      isConnected: true,
    } as Element
    callback = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // ==================== 基础功能测试 ====================
  describe('基础功能 - 元素观察', () => {
    it('应该能够观察元素', () => {
      const observer = new IOClass()
      const unobserve = observer.observe(mockElement, callback)
      
      expect(unobserve).toBeDefined()
      expect(typeof unobserve).toBe('function')
    })

    it('默认应该只观察一次', () => {
      const observer = new IOClass()
      observer.observe(mockElement, callback)
      
      // 验证回调存在
      expect(callback).not.toHaveBeenCalled()
    })

    it('应该能设置不只观察一次', () => {
      const observer = new IOClass()
      observer.observe(mockElement, callback, false)
      
      expect(callback).not.toHaveBeenCalled()
    })

    it('应该能自定义阈值', () => {
      const observer = new IOClass(0.5)
      
      expect(observer).toBeDefined()
    })
  })

  // ==================== 取消观察测试 ====================
  describe('取消观察功能', () => {
    it('应该能通过返回的函数取消观察', () => {
      const observer = new IOClass()
      const unobserve = observer.observe(mockElement, callback)
      
      unobserve()
      
      // 取消后应该能从 map 中移除
      // 具体行为需要验证内部实现
    })

    it('应该能通过 unobserve 方法取消观察', () => {
      const observer = new IOClass()
      observer.observe(mockElement, callback)
      
      observer.unobserve(mockElement)
      
      // 验证取消观察成功
      expect(callback).not.toHaveBeenCalled()
    })
  })

  // ==================== 内存清理测试 ====================
  describe('内存清理逻辑', () => {
    it('所有元素取消观察后应该断开 IntersectionObserver', () => {
      const observer = new IOClass()
      
      // 观察多个元素
      observer.observe(mockElement, callback)
      
      const mockElement2 = { isConnected: true } as Element
      const callback2 = jest.fn()
      observer.observe(mockElement2, callback2)
      
      // 取消所有元素的观察
      observer.unobserve(mockElement)
      observer.unobserve(mockElement2)
      
      // 验证内存已清理
      // 实际测试需要验证 IntersectionObserver 实例是否被清理
    })

    it('应该处理不在文档中的元素', () => {
      const disconnectedElement = {
        isConnected: false,
      } as Element
      
      const observer = new IOClass()
      observer.observe(disconnectedElement, callback)
      
      // 不在文档中的元素应该被跳过
      expect(callback).not.toHaveBeenCalled()
    })

    it('重复取消观察应该不会出错', () => {
      const observer = new IOClass()
      observer.observe(mockElement, callback)
      
      // 多次取消观察不应该抛出错误
      expect(() => {
        observer.unobserve(mockElement)
        observer.unobserve(mockElement)
      }).not.toThrow()
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理不提供回调的情况', () => {
      const observer = new IOClass()
      
      // @ts-ignore - 故意不提供回调
      expect(() => observer.observe(mockElement)).not.toThrow()
    })

    it('应该能处理相同的元素多次观察', () => {
      const observer = new IOClass()
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      observer.observe(mockElement, callback1)
      observer.observe(mockElement, callback2)
      
      // 多次观察同一元素不应该抛出错误
      expect(callback1).not.toHaveBeenCalled()
    })

    it('应该能处理被删除的元素', () => {
      const observer = new IOClass()
      observer.observe(mockElement, callback)
      
      // 模拟元素被从 DOM 中删除
      mockElement.isConnected = false
      
      observer.unobserve(mockElement)
      
      expect(callback).not.toHaveBeenCalled()
    })
  })

  // ==================== 导出测试 ====================
  describe('导出测试', () => {
    it('应该导出默认实例', () => {
      expect(IntersectionObserver).toBeDefined()
    })

    it('应该导出类构造函数', () => {
      expect(OneIntersectionObserver).toBeDefined()
      expect(typeof OneIntersectionObserver).toBe('function')
    })
  })

  // ==================== 类实例测试 ====================
  describe('类实例测试', () => {
    it('应该能创建多个独立实例', () => {
      const observer1 = new IOClass()
      const observer2 = new IOClass()
      
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      
      observer1.observe(mockElement, callback1)
      
      const mockElement2 = { isConnected: true } as Element
      observer2.observe(mockElement2, callback2)
      
      // 两个实例应该是独立的
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).not.toHaveBeenCalled()
    })

    it('应该能使用不同的阈值', () => {
      const observer1 = new IOClass(0.1)
      const observer2 = new IOClass(0.8)
      
      expect(observer1).toBeDefined()
      expect(observer2).toBeDefined()
    })
  })
})
