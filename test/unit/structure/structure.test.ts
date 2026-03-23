import { structure } from '@/structure/structure'

describe('structure 模块测试', () => {
  // ==================== 基础功能测试 ====================
  describe('基础功能 - 单键访问', () => {
    it('应该能访问对象的顶层属性', () => {
      const data = { name: 'John', age: 30 }
      expect(structure('name', data)).toBe('John')
      expect(structure('age', data)).toBe(30)
    })

    it('应该能访问嵌套属性', () => {
      const data = { user: { name: 'John', profile: { age: 30 } } }
      expect(structure('user.name', data)).toBe('John')
      expect(structure('user.profile.age', data)).toBe(30)
    })

    it('应该能访问多层嵌套属性', () => {
      const data = { a: { b: { c: { d: 'deep' } } } }
      expect(structure('a.b.c.d', data)).toBe('deep')
    })
  })

  // ==================== 默认值测试 ====================
  describe('默认值处理', () => {
    it('属性不存在时应该返回默认值', () => {
      const data = { name: 'John' }
      expect(structure('age', data, 'default')).toBe('default')
      expect(structure('age', data, undefined)).toBe(undefined)
      expect(structure('age', data, null)).toBe(null)
    })

    it('空键名时应该返回数据或默认值', () => {
      const data = { name: 'John' }
      expect(structure('', data)).toBe(data)
      expect(structure('', data, 'default')).toBe(data)
    })

    it('空对象应该返回默认值', () => {
      expect(structure('name', {}, 'default')).toBe('default')
      expect(structure('name', null as any, 'default')).toBe('default')
    })

    it('undefined 数据应该返回默认值', () => {
      expect(structure('name', undefined, 'default')).toBe('default')
    })
  })

  // ==================== 中间值为 null/undefined ====================
  describe('中间路径为 null/undefined', () => {
    it('中间值为 null 时应该返回默认值', () => {
      const data = { user: null }
      expect(structure('user.name', data, 'default')).toBe('default')
    })

    it('中间值为 undefined 时应该返回默认值', () => {
      const data = { user: undefined }
      expect(structure('user.name', data, 'default')).toBe('default')
    })

    it('部分路径存在时应该正确处理', () => {
      const data = { user: { name: null } }
      expect(structure('user.name', data)).toBe(null)
      expect(structure('user.name', data, 'default')).toBe(null) // null 是有效值
    })
  })

  // ==================== 数组键测试 ====================
  describe('数组键测试', () => {
    it('应该接受字符串键并直接返回结果', () => {
      const data = { name: 'John' }
      expect(structure('name', data)).toBe('John')
    })

    it('应该能处理键数组 - 返回第一个有效值', () => {
      const data = { name: 'John', nickname: 'J' }
      expect(structure(['name', 'nickname'], data)).toBe('John')
    })

    it('应该跳过无效值并返回下一个有效值', () => {
      const data = { name: null, nickname: 'J' }
      expect(structure(['name', 'nickname'], data)).toBe('J')
    })

    it('应该跳过 undefined 并返回有效值', () => {
      const data = { name: undefined, nickname: 'J' }
      expect(structure(['name', 'nickname'], data)).toBe('J')
    })

    it('应该跳过 null 并返回有效值', () => {
      const data = { name: null, nickname: 'J' }
      expect(structure(['name', 'nickname'], data)).toBe('J')
    })

    it('所有键都无效时应该返回默认值', () => {
      const data = { name: null, nickname: undefined }
      expect(structure(['name', 'nickname'], data, 'default')).toBe('default')
    })

    it('空数组键应该返回默认值', () => {
      const data = { name: 'John' }
      expect(structure([], data, 'default')).toBe('default')
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理特殊字符作为属性名', () => {
      const data = { 'user-name': 'John', 'user_name': 'Jane' }
      expect(structure('user-name', data)).toBe('John')
      expect(structure('user_name', data)).toBe('Jane')
    })

    it('应该能处理数字属性名', () => {
      const data = { 0: 'first', 1: 'second' }
      expect(structure('0', data)).toBe('first')
    })

    it('应该能处理包含数字的键路径', () => {
      const data = { users: [{ name: 'John' }, { name: 'Jane' }] }
      expect(structure('users.0.name', data)).toBe('John')
      expect(structure('users.1.name', data)).toBe('Jane')
    })

    it('应该能处理空字符串属性值', () => {
      const data = { name: '' }
      expect(structure('name', data)).toBe('')
      expect(structure('name', data, 'default')).toBe('')
    })

    it('应该能处理布尔值', () => {
      const data = { isActive: true, isDeleted: false }
      expect(structure('isActive', data)).toBe(true)
      expect(structure('isDeleted', data)).toBe(false)
    })

    it('应该能处理数字零和空数组', () => {
      const data = { count: 0, items: [] }
      expect(structure('count', data)).toBe(0)
      expect(structure('items', data)).toEqual([])
    })

    it('应该能处理对象中的函数', () => {
      const fn = () => 'test'
      const data = { handler: fn }
      expect(structure('handler', data)).toBe(fn)
    })
  })

  // ==================== 类型一致性测试 ====================
  describe('类型一致性测试', () => {
    it('应该保持返回值的原始类型', () => {
      const data = { num: 123, bool: true, arr: [1, 2, 3] }
      expect(structure('num', data)).toBe(123)
      expect(structure('bool', data)).toBe(true)
      expect(structure('arr', data)).toEqual([1, 2, 3])
    })

    it('应该能返回对象和数组的引用', () => {
      const data = { items: [1, 2, 3] }
      const result = structure('items', data)
      expect(result).toEqual([1, 2, 3])
      expect(result).toBe(data.items) // structure 返回的是引用，不是深拷贝
    })
  })

  // ==================== 性能测试 ====================
  describe('性能测试', () => {
    it('大量嵌套应该能正确处理', () => {
      // 创建20层嵌套
      let data: any = { value: 'deep' }
      for (let i = 0; i < 19; i++) {
        data = { child: data }
      }
      let path = 'value'
      for (let i = 0; i < 19; i++) {
        path = 'child.' + path
      }
      expect(structure(path, data)).toBe('deep')
    })
  })
})
