import { encodeURIZnCh } from '@/encodeURIZnCh/encodeURIZnCh'

describe('encodeURIZnCh 模块测试', () => {
  // ==================== 基础功能测试 ====================
  describe('基础功能 - 中文字符编码', () => {
    it('应该能编码简单的中文字符', () => {
      const url = 'https://example.com/搜索'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toBe('https://example.com/%E6%90%9C%E7%B4%A2')
    })

    it('应该能编码包含中文的查询参数', () => {
      const url = 'https://example.com/search?query=测试'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toBe('https://example.com/search?query=%E6%B5%8B%E8%AF%95')
    })

    it('应该能编码完整的中文 URL', () => {
      const url = 'https://example.com/搜索？查询=测试'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toBe('https://example.com/%E6%90%9C%E7%B4%A2%EF%BC%9F%E6%9F%A5%E8%AF%A2=%E6%B5%8B%E8%AF%95')
    })
  })

  // ==================== 标点符号测试 ====================
  describe('中文标点符号编码', () => {
    it('应该能编码中文标点符号', () => {
      const text = '你好，世界！'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toContain('%E4%BD%A0%E5%A5%BD')
      expect(encoded).toContain('%E4%B8%96%E7%95%8C')
    })

    it('应该能编码各种中文标点', () => {
      const text = '测试。测试？测试！测试，测试；测试：'
      const encoded = encodeURIZnCh(text)
      // 验证编码后包含百分号
      expect(encoded).toMatch(/%[0-9A-F]{2}/)
    })

    it('应该能编码中文引号', () => {
      const text = '"测试"'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toMatch(/%[0-9A-F]{2}/)
    })

    it('应该能编码中文括号', () => {
      const text = '（测试）'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toMatch(/%[0-9A-F]{2}/)
    })

    it('应该能编码书名号', () => {
      const text = '《测试》'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toMatch(/%[0-9A-F]{2}/)
    })

    it('应该能编码省略号', () => {
      const text = '测试……'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toMatch(/%[0-9A-F]{2}/)
    })

    it('应该能编码破折号', () => {
      const text = '测试——测试'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toMatch(/%[0-9A-F]{2}/)
    })

    it('应该能编码人民币符号', () => {
      const text = '￥100'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toBe('%EF%BF%A5100')
    })
  })

  // ==================== 无中文字符测试 ====================
  describe('无中文字符的情况', () => {
    it('纯英文 URL 应该保持不变', () => {
      const url = 'https://example.com/search'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toBe(url)
    })

    it('纯英文路径应该保持不变', () => {
      const url = '/api/v1/users'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toBe(url)
    })

    it('包含特殊字符的英文 URL 应该保持不变', () => {
      const url = 'https://example.com/search?query=test&page=1'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toBe(url)
    })
  })

  // ==================== 混合内容测试 ====================
  describe('中英文混合内容', () => {
    it('应该只编码中文部分', () => {
      const url = 'https://example.com/search 测试 query 测试'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toContain('https://example.com/search')
      expect(encoded).toContain('query')
      expect(encoded).toMatch(/%E6%B5%8B%E8%AF%95/)
    })

    it('应该能处理中文和数字混合', () => {
      const text = '测试 123 测试'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toContain('123')
      expect(encoded).toMatch(/%E6%B5%8B%E8%AF%95/)
    })

    it('应该能处理中文和特殊符号混合', () => {
      const text = '测试@#$测试'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toContain('@#$')
      expect(encoded).toMatch(/%E6%B5%8B%E8%AF%95/)
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('空字符串应该返回空字符串', () => {
      expect(encodeURIZnCh('')).toBe('')
    })

    it('单个中文字符应该能正确编码', () => {
      const encoded = encodeURIZnCh('测')
      expect(encoded).toBe('%E6%B5%8B')
    })

    it('连续的中文字符应该能正确编码', () => {
      const text = '一二三四五六七八九十'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toMatch(/%E4%B8%80%E4%BA%8C%E4%B8%89%E5%9B%9B%E4%BA%94%E5%85%AD%E4%B8%83%E5%85%AB%E4%B9%9D%E5%8D%81/)
    })

    it('很长的中文 URL 应该能正确处理', () => {
      const url = 'https://example.com/' + '测'.repeat(100)
      const encoded = encodeURIZnCh(url)
      expect(encoded).toContain('https://example.com/')
      expect(encoded.length).toBeGreaterThan(url.length)
    })
  })

  // ==================== 特殊字符测试 ====================
  describe('特殊字符和 emoji', () => {
    it('应该不编码 emoji', () => {
      const text = '测试😀'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toContain('😀')
    })

    it('应该不编码普通标点符号', () => {
      const text = 'test, hello.'
      const encoded = encodeURIZnCh(text)
      expect(encoded).toBe(text)
    })

    it('应该正确处理 URL 中的 hash', () => {
      const url = 'https://example.com/搜索#结果'
      const encoded = encodeURIZnCh(url)
      expect(encoded).toContain('#')
      expect(encoded).toMatch(/%E6%90%9C%E7%B4%A2/)
      expect(encoded).toMatch(/%E7%BB%93%E6%9E%9C/)
    })
  })

  // ==================== 性能测试 ====================
  describe('性能测试', () => {
    it('应该能快速处理大量中文', () => {
      const text = '测'.repeat(1000)
      const start = Date.now()
      const encoded = encodeURIZnCh(text)
      const duration = Date.now() - start
      
      expect(encoded).toMatch(/%E6%B5%8B/)
      expect(duration).toBeLessThan(100) // 应该在 100ms 内完成
    })
  })
})
