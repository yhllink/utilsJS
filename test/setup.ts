// 全局测试配置
beforeAll(() => {
  // 全局测试前钩子
})

afterAll(() => {
  // 全局测试后钩子
})

// 模拟 IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
  takeRecords = jest.fn(() => [])
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
}

(global as any).IntersectionObserver = MockIntersectionObserver
