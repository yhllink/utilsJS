import { deepClone } from '@/deepClone/deepClone'

describe('deepClone 模块测试', () => {
  // ==================== 基础类型测试 ====================
  describe('基础类型', () => {
    it('应该能克隆 null', () => {
      expect(deepClone(null)).toBe(null)
    })

    it('应该能克隆 undefined', () => {
      expect(deepClone(undefined)).toBe(undefined)
    })

    it('应该能克隆数字', () => {
      expect(deepClone(123)).toBe(123)
      expect(deepClone(0)).toBe(0)
      expect(deepClone(-123)).toBe(-123)
      expect(deepClone(3.14)).toBe(3.14)
    })

    it('应该能克隆字符串', () => {
      expect(deepClone('hello')).toBe('hello')
      expect(deepClone('')).toBe('')
    })

    it('应该能克隆布尔值', () => {
      expect(deepClone(true)).toBe(true)
      expect(deepClone(false)).toBe(false)
    })
  })

  // ==================== Date 类型测试 ====================
  describe('Date 类型', () => {
    it('应该能克隆 Date 对象', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const cloned = deepClone(date)
      
      expect(cloned instanceof Date).toBe(true)
      expect(cloned.getTime()).toBe(date.getTime())
    })

    it('克隆的 Date 应该是新实例', () => {
      const date = new Date()
      const cloned = deepClone(date)
      
      expect(cloned).not.toBe(date)
    })

    it('应该能克隆不同时间的 Date', () => {
      const dates = [
        new Date(0),
        new Date('1970-01-01'),
        new Date('2099-12-31'),
      ]
      
      dates.forEach(date => {
        const cloned = deepClone(date)
        expect(cloned.getTime()).toBe(date.getTime())
      })
    })
  })

  // ==================== RegExp 类型测试 ====================
  describe('RegExp 类型', () => {
    it('应该能克隆普通正则表达式', () => {
      const regex = /abc/gi
      const cloned = deepClone(regex)
      
      expect(cloned instanceof RegExp).toBe(true)
      expect(cloned.source).toBe(regex.source)
      expect(cloned.flags).toBe(regex.flags)
    })

    it('应该能克隆带复杂模式的正则', () => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gi
      const cloned = deepClone(regex)
      
      expect(cloned.source).toBe(regex.source)
      expect(cloned.flags).toBe(regex.flags)
    })

    it('克隆的正则应该是新实例', () => {
      const regex = /test/
      const cloned = deepClone(regex)
      
      expect(cloned).not.toBe(regex)
    })
  })

  // ==================== Map 类型测试 ====================
  describe('Map 类型', () => {
    it('应该能克隆空 Map', () => {
      const map = new Map()
      const cloned = deepClone(map)
      
      expect(cloned instanceof Map).toBe(true)
      expect(cloned.size).toBe(0)
    })

    it('应该能克隆包含数据的 Map', () => {
      const map = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ])
      const cloned = deepClone(map)
      
      expect(cloned instanceof Map).toBe(true)
      expect(cloned.get('key1')).toBe('value1')
      expect(cloned.get('key2')).toBe('value2')
    })

    it('应该能克隆包含对象的 Map', () => {
      const map = new Map([
        ['key', { a: 1 }],
      ])
      const cloned = deepClone(map)
      
      expect(cloned.get('key')).toEqual({ a: 1 })
      expect(cloned.get('key')).not.toBe(map.get('key'))
    })

    it('应该能克隆嵌套的 Map', () => {
      const map = new Map([
        ['key1', new Map([['nested', 'value']])],
      ])
      const cloned = deepClone(map)
      
      expect(cloned.get('key1') instanceof Map).toBe(true)
      expect(cloned.get('key1').get('nested')).toBe('value')
    })
  })

  // ==================== Set 类型测试 ====================
  describe('Set 类型', () => {
    it('应该能克隆空 Set', () => {
      const set = new Set()
      const cloned = deepClone(set)
      
      expect(cloned instanceof Set).toBe(true)
      expect(cloned.size).toBe(0)
    })

    it('应该能克隆包含数据的 Set', () => {
      const set = new Set([1, 2, 3, 'a', 'b'])
      const cloned = deepClone(set)
      
      expect(cloned instanceof Set).toBe(true)
      expect(cloned.has(1)).toBe(true)
      expect(cloned.has('a')).toBe(true)
      expect(cloned.size).toBe(5)
    })

    it('应该能克隆包含对象的 Set', () => {
      const obj = { a: 1 }
      const set = new Set([obj])
      const cloned = deepClone(set)
      
      const clonedObj = [...cloned][0]
      expect(clonedObj).toEqual({ a: 1 })
      expect(clonedObj).not.toBe(obj)
    })
  })

  // ==================== 数组测试 ====================
  describe('数组', () => {
    it('应该能克隆空数组', () => {
      expect(deepClone([])).toEqual([])
    })

    it('应该能克隆包含基础类型的数组', () => {
      const arr = [1, 2, 3, 'a', 'b', true]
      const cloned = deepClone(arr)
      
      expect(cloned).toEqual(arr)
      expect(cloned).not.toBe(arr)
    })

    it('应该能克隆嵌套数组', () => {
      const arr = [1, [2, [3, [4]]]]
      const cloned = deepClone(arr)
      
      expect(cloned).toEqual(arr)
      expect(cloned[1]).not.toBe(arr[1])
      expect(cloned[1][1]).not.toBe(arr[1][1])
    })

    it('应该能克隆包含对象的数组', () => {
      const arr = [{ a: 1 }, { b: 2 }]
      const cloned = deepClone(arr)
      
      expect(cloned).toEqual(arr)
      expect(cloned[0]).not.toBe(arr[0])
      expect(cloned[1]).not.toBe(arr[1])
    })
  })

  // ==================== 对象测试 ====================
  describe('对象', () => {
    it('应该能克隆空对象', () => {
      expect(deepClone({})).toEqual({})
    })

    it('应该能克隆普通对象', () => {
      const obj = { a: 1, b: 'hello', c: true }
      const cloned = deepClone(obj)
      
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
    })

    it('应该能克隆嵌套对象', () => {
      const obj = { a: { b: { c: 1 } } }
      const cloned = deepClone(obj)
      
      expect(cloned).toEqual(obj)
      expect(cloned.a).not.toBe(obj.a)
      expect(cloned.a.b).not.toBe(obj.a.b)
    })

    it('应该能克隆包含函数的对象（函数直接返回）', () => {
      const fn = () => 'test'
      const obj = { fn }
      const cloned = deepClone(obj)
      
      expect(cloned.fn).toBe(fn) // 函数直接返回，不克隆
    })

    it('应该保留对象的原型链', () => {
      class TestClass {
        prop = 'value'
      }
      const obj = new TestClass()
      const cloned = deepClone(obj)
      
      expect(cloned instanceof TestClass).toBe(true)
      expect(cloned.prop).toBe('value')
    })
  })

  // ==================== 循环引用测试 ====================
  describe('循环引用', () => {
    it('应该能处理对象自引用', () => {
      const obj: any = { a: 1 }
      obj.self = obj
      
      const cloned = deepClone(obj)
      
      expect(cloned.a).toBe(1)
      expect(cloned.self).toBe(cloned) // 循环引用指向克隆后的对象
      expect(cloned.self).not.toBe(obj) // 不是原对象
    })

    it('应该能处理数组自引用', () => {
      const arr: any = [1, 2]
      arr.push(arr)
      
      const cloned = deepClone(arr)
      
      expect(cloned[0]).toBe(1)
      expect(cloned[1]).toBe(2)
      expect(cloned[2]).toBe(cloned)
    })

    it('应该能处理相互引用的对象', () => {
      const objA: any = { name: 'A' }
      const objB: any = { name: 'B' }
      objA.ref = objB
      objB.ref = objA
      
      const clonedA = deepClone(objA)
      
      expect(clonedA.name).toBe('A')
      expect(clonedA.ref.name).toBe('B')
      expect(clonedA.ref.ref).toBe(clonedA) // 循环引用正确处理
    })

    it('应该能处理复杂的多重循环引用', () => {
      const obj: any = {
        level1: {
          level2: {
            level3: {},
          },
        },
      }
      obj.level1.level2.level3.back = obj.level1.level2
      obj.level1.back = obj
      
      const cloned = deepClone(obj)
      
      expect(cloned.level1.level2.level3.back).toBe(cloned.level1.level2)
      expect(cloned.level1.back).toBe(cloned)
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能克隆 Symbol 作为属性名', () => {
      const sym = Symbol('test')
      const obj = { [sym]: 'value' }
      const cloned = deepClone(obj)
      
      expect(cloned[sym]).toBe('value')
    })

    it('应该能克隆包含 undefined 的数组', () => {
      const arr = [1, undefined, 3]
      const cloned = deepClone(arr)
      
      expect(cloned).toEqual([1, undefined, 3])
    })

    it('应该能克隆包含 null 的数组', () => {
      const arr = [1, null, 3]
      const cloned = deepClone(arr)
      
      expect(cloned).toEqual([1, null, 3])
    })

    it('应该能克隆 NaN', () => {
      const obj = { value: NaN }
      const cloned = deepClone(obj)
      
      expect(Number.isNaN(cloned.value)).toBe(true)
    })

    it('应该能克隆 Infinity', () => {
      const obj = { value: Infinity }
      const cloned = deepClone(obj)
      
      expect(cloned.value).toBe(Infinity)
    })

    it('应该能克隆负零', () => {
      const obj = { value: -0 }
      const cloned = deepClone(obj)
      
      expect(cloned.value).toBe(-0)
    })
  })

  // ==================== Blob 类型测试 ====================
  describe('Blob 类型', () => {
    it('应该能克隆 Blob', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' })
      const cloned = deepClone(blob)
      
      expect(cloned instanceof Blob).toBe(true)
      expect(cloned.size).toBe(blob.size)
      expect(cloned.type).toBe(blob.type)
    })

    it('克隆的 Blob 应该是新实例', () => {
      const blob = new Blob(['test'], { type: 'text/plain' })
      const cloned = deepClone(blob)
      
      expect(cloned).not.toBe(blob)
    })
  })
})
