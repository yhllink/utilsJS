import { classNames } from '@/classNames/classNames'

describe('classNames 模块测试', () => {
  // ==================== 基础功能测试 ====================
  describe('基础功能 - 字符串参数', () => {
    it('应该能处理单个字符串', () => {
      expect(classNames('foo')).toBe('foo')
    })

    it('应该能处理多个字符串', () => {
      expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz')
    })

    it('应该能处理空字符串', () => {
      expect(classNames('')).toBe('')
    })

    it('应该能处理多个空字符串', () => {
      expect(classNames('', '', '')).toBe('')
    })

    it('应该能处理包含空格的字符串', () => {
      expect(classNames('foo bar', 'baz')).toBe('foo bar baz')
    })
  })

  // ==================== 数组参数测试 ====================
  describe('数组参数', () => {
    it('应该能处理字符串数组', () => {
      expect(classNames(['foo', 'bar', 'baz'])).toBe('foo bar baz')
    })

    it('应该能处理嵌套数组', () => {
      expect(classNames(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })

    it('应该能处理多层嵌套数组', () => {
      expect(classNames(['a', ['b', ['c', ['d']]]])).toBe('a b c d')
    })

    it('应该能处理空数组', () => {
      expect(classNames([])).toBe('')
    })

    it('应该能处理包含空字符串的数组', () => {
      expect(classNames(['foo', '', 'bar'])).toBe('foo bar')
    })

    it('应该能处理混合数组和字符串', () => {
      expect(classNames('a', ['b', 'c'], 'd')).toBe('a b c d')
    })
  })

  // ==================== 对象参数测试 ====================
  describe('对象参数', () => {
    it('应该能处理键值对对象', () => {
      expect(classNames({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('应该能处理全为 false 的对象', () => {
      expect(classNames({ foo: false, bar: false })).toBe('')
    })

    it('应该能处理全为 true 的对象', () => {
      expect(classNames({ foo: true, bar: true })).toBe('foo bar')
    })

    it('应该能处理空对象', () => {
      expect(classNames({})).toBe('')
    })

    it('应该能处理包含空字符串键的对象', () => {
      expect(classNames({ '': true, foo: true })).toBe(' foo')
    })
  })

  // ==================== 混合参数测试 ====================
  describe('混合参数类型', () => {
    it('应该能处理字符串和对象混合', () => {
      expect(classNames('foo', { bar: true, baz: false })).toBe('foo bar')
    })

    it('应该能处理字符串和数组混合', () => {
      expect(classNames('foo', ['bar', 'baz'])).toBe('foo bar baz')
    })

    it('应该能处理对象和数组混合', () => {
      expect(classNames({ foo: true }, ['bar', 'baz'])).toBe('foo bar baz')
    })

    it('应该能处理所有类型混合', () => {
      expect(classNames('a', { b: true, c: false }, ['d', 'e'], 'f')).toBe('a b d e f')
    })

    it('应该能处理复杂的嵌套混合', () => {
      expect(classNames(
        'a',
        { b: true, c: false },
        ['d', { e: true, f: false }],
        'g'
      )).toBe('a b d e g')
    })
  })

  // ==================== 假值处理测试 ====================
  describe('假值处理', () => {
    it('应该能处理 null', () => {
      expect(classNames(null as any)).toBe('')
    })

    it('应该能处理 undefined', () => {
      expect(classNames(undefined as any)).toBe('')
    })

    it('应该能处理 false', () => {
      expect(classNames(false as any)).toBe('')
    })

    it('应该能处理 0', () => {
      expect(classNames(0 as any)).toBe('')
    })

    it('应该能处理多个假值', () => {
      expect(classNames(null as any, undefined as any, false as any, 0 as any)).toBe('')
    })

    it('应该能忽略数组中的假值', () => {
      expect(classNames([null as any, 'foo', undefined as any, 'bar'])).toBe('foo bar')
    })

    it('应该能忽略对象中的假值', () => {
      expect(classNames({ foo: null as any, bar: 0 as any, baz: true })).toBe('baz')
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理无参数', () => {
      expect(classNames()).toBe('')
    })

    it('应该能处理特殊字符类名', () => {
      expect(classNames('foo-bar', 'baz_qux', 'test123')).toBe('foo-bar baz_qux test123')
    })

    it('应该能处理 emoji 类名', () => {
      expect(classNames('😀', '🎉')).toBe('😀 🎉')
    })

    it('应该能处理中文类名', () => {
      expect(classNames('测试', '中文')).toBe('测试 中文')
    })

    it('应该能处理很长的类名', () => {
      const longName = 'a'.repeat(1000)
      expect(classNames(longName)).toBe(longName)
    })
  })

  // ==================== 实际使用场景测试 ====================
  describe('实际使用场景', () => {
    it('应该能处理 React 组件常见用法', () => {
      const isActive = true
      const isDisabled = false
      const className = 'btn'
      
      const result = classNames(
        className,
        {
          'btn-active': isActive,
          'btn-disabled': isDisabled,
        }
      )
      
      expect(result).toBe('btn btn-active')
    })

    it('应该能处理条件类名', () => {
      const type = 'primary'
      const size = 'large'
      
      const result = classNames(
        'button',
        `button-${type}`,
        `button-${size}`
      )
      
      expect(result).toBe('button button-primary button-large')
    })

    it('应该能处理动态类名数组', () => {
      const modifiers = ['active', 'focused']
      
      const result = classNames(
        'input',
        modifiers.map(m => `input-${m}`)
      )
      
      expect(result).toBe('input input-active input-focused')
    })

    it('应该能处理复杂的条件组合', () => {
      const variant = 'primary'
      const size = 'medium'
      const disabled = false
      const loading = true
      
      const result = classNames(
        'button',
        {
          [`button-${variant}`]: variant,
          [`button-${size}`]: size,
          'button-disabled': disabled,
          'button-loading': loading,
        }
      )
      
      expect(result).toBe('button button-primary button-medium button-loading')
    })
  })

  // ==================== 性能测试 ====================
  describe('性能测试', () => {
    it('应该能快速处理大量参数', () => {
      const args = Array.from({ length: 1000 }, (_, i) => `class-${i}`)
      const start = Date.now()
      const result = classNames(...args)
      const duration = Date.now() - start
      
      expect(result.split(' ').length).toBe(1000)
      expect(duration).toBeLessThan(100) // 100ms 内完成
    })

    it('应该能快速处理深度嵌套数组', () => {
      const nested = ['a', ['b', ['c', ['d', ['e', ['f']]]]]]
      const start = Date.now()
      classNames(nested)
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(100)
    })
  })

  // ==================== 返回值格式测试 ====================
  describe('返回值格式', () => {
    it('应该返回字符串类型', () => {
      expect(typeof classNames('foo')).toBe('string')
    })

    it('应该使用单个空格分隔类名', () => {
      expect(classNames('a', 'b', 'c')).toBe('a b c')
    })

    it('不应该包含首尾空格', () => {
      const result = classNames('foo')
      expect(result).toBe(result.trim())
    })

    it('应该保持类名顺序', () => {
      expect(classNames('a', 'b', 'c')).toBe('a b c')
      expect(classNames('c', 'b', 'a')).toBe('c b a')
    })
  })
})
