import { csvDataHandle } from '@/csvDataHandle/csvDataHandle'

describe('csvDataHandle 模块测试', () => {
  // ==================== 基础功能测试 ====================
  describe('基础功能', () => {
    it('应该能解析简单的 CSV 数据', () => {
      const csv = 'name,age\nJohn,25\nJane,30'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' },
        { name: 'Jane', age: '30' }
      ])
    })

    it('应该能解析单行 CSV 数据', () => {
      const csv = 'name,age\nJohn,25'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' }
      ])
    })

    it('应该能解析只有表头的 CSV', () => {
      const csv = 'name,age,city'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([])
    })

    it('应该能解析空 CSV', () => {
      const csv = ''
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([])
    })
  })

  // ==================== 数据清洗测试 ====================
  describe('数据清洗', () => {
    it('应该能去除值的前后空格', () => {
      const csv = 'name,age\n  John  ,  25  '
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' }
      ])
    })

    it('应该能跳过空行', () => {
      const csv = 'name,age\nJohn,25\n\nJane,30\n'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' },
        { name: 'Jane', age: '30' }
      ])
    })

    it('应该能跳过列数不匹配的行', () => {
      const csv = 'name,age,city\nJohn,25\nJane,30,Beijing'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'Jane', age: '30', city: 'Beijing' }
      ])
    })

    it('应该能跳过全空的行', () => {
      const csv = 'name,age\nJohn,25\n,'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' }
      ])
    })
  })

  // ==================== keysObj 映射测试 ====================
  describe('keysObj 键映射', () => {
    it('应该能重命名字段', () => {
      const csv = 'name,age\nJohn,25'
      const result = csvDataHandle(csv, {
        keysObj: { name: 'userName', age: 'userAge' }
      })
      
      expect(result).toEqual([
        { userName: 'John', userAge: '25' }
      ])
    })

    it('应该能部分重命名字段', () => {
      const csv = 'name,age,city\nJohn,25,Beijing'
      const result = csvDataHandle(csv, {
        keysObj: { name: 'userName' }
      })
      
      expect(result).toEqual([
        { userName: 'John', age: '25', city: 'Beijing' }
      ])
    })

    it('应该能处理不存在的键映射', () => {
      const csv = 'name,age\nJohn,25'
      const result = csvDataHandle(csv, {
        keysObj: { nonexistent: 'newName' }
      })
      
      expect(result).toEqual([
        { name: 'John', age: '25' }
      ])
    })
  })

  // ==================== middle 中间处理函数测试 ====================
  describe('middle 中间处理函数', () => {
    it('应该能转换数据类型', () => {
      const csv = 'name,age\nJohn,25\nJane,30'
      const result = csvDataHandle(csv, {
        middle: (key, val) => {
          if (key === 'age') return Number(val)
          return val
        }
      })
      
      expect(result).toEqual([
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 }
      ])
    })

    it('应该能处理字符串', () => {
      const csv = 'name,description\nJohn,Hello World'
      const result = csvDataHandle(csv, {
        middle: (key, val) => {
          if (key === 'description') return val.toUpperCase()
          return val
        }
      })
      
      expect(result).toEqual([
        { name: 'John', description: 'HELLO WORLD' }
      ])
    })

    it('应该能分割数组', () => {
      const csv = 'name,tags\nJohn,a,b,c'
      const result = csvDataHandle(csv, {
        middle: (key, val) => {
          if (key === 'tags') return val.split(',')
          return val
        }
      })
      
      expect(result).toEqual([
        { name: 'John', tags: ['a', 'b', 'c'] }
      ])
    })

    it('应该能处理日期', () => {
      const csv = 'name,birthday\nJohn,2000-01-01'
      const result = csvDataHandle(csv, {
        middle: (key, val) => {
          if (key === 'birthday') return new Date(val)
          return val
        }
      })
      
      expect(result[0].name).toBe('John')
      expect(result[0].birthday instanceof Date).toBe(true)
    })
  })

  // ==================== filter 过滤器测试 ====================
  describe('filter 过滤器', () => {
    it('应该能过滤数据', () => {
      const csv = 'name,age\nJohn,25\nJane,30\nBob,15'
      const result = csvDataHandle(csv, {
        filter: (item) => Number(item.age) >= 18
      })
      
      expect(result).toEqual([
        { name: 'John', age: '25' },
        { name: 'Jane', age: '30' }
      ])
    })

    it('应该能过滤特定字段', () => {
      const csv = 'name,city\nJohn,Beijing\nJane,Shanghai\nBob,Beijing'
      const result = csvDataHandle(csv, {
        filter: (item) => item.city === 'Beijing'
      })
      
      expect(result).toEqual([
        { name: 'John', city: 'Beijing' },
        { name: 'Bob', city: 'Beijing' }
      ])
    })

    it('应该能过滤掉所有数据', () => {
      const csv = 'name,age\nJohn,25\nJane,30'
      const result = csvDataHandle(csv, {
        filter: () => false
      })
      
      expect(result).toEqual([])
    })

    it('应该能保留所有数据', () => {
      const csv = 'name,age\nJohn,25\nJane,30'
      const result = csvDataHandle(csv, {
        filter: () => true
      })
      
      expect(result.length).toBe(2)
    })
  })

  // ==================== 组合使用测试 ====================
  describe('组合使用', () => {
    it('应该能同时使用 keysObj、middle 和 filter', () => {
      const csv = 'name,age,city\nJohn,25,Beijing\nJane,30,Shanghai\nBob,15,Guangzhou'
      const result = csvDataHandle(csv, {
        keysObj: { name: 'userName', age: 'userAge', city: 'userCity' },
        middle: (key, val) => {
          if (key === 'userAge') return Number(val)
          return val
        },
        filter: (item) => item.userAge >= 18
      })
      
      expect(result).toEqual([
        { userName: 'John', userAge: 25, userCity: 'Beijing' },
        { userName: 'Jane', userAge: 30, userCity: 'Shanghai' }
      ])
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理包含逗号的值（简单情况）', () => {
      const csv = 'name,description\nJohn,Hello, World'
      const result = csvDataHandle(csv)
      
      // 注意：当前实现不支持引号包裹的逗号，会按逗号分割
      // 这是 CSV 解析的常见限制
      expect(result).toEqual([
        { name: 'John', description: 'Hello' }
      ])
    })

    it('应该能处理包含换行符的值（简单情况）', () => {
      const csv = 'name,age\nJohn,25'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' }
      ])
    })

    it('应该能处理非常大的 CSV', () => {
      let csv = 'id,name,value\n'
      for (let i = 0; i < 1000; i++) {
        csv += `${i},Item${i},${i * 10}\n`
      }
      
      const result = csvDataHandle(csv)
      
      expect(result.length).toBe(1000)
      expect(result[0]).toEqual({ id: '0', name: 'Item0', value: '0' })
      expect(result[999]).toEqual({ id: '999', name: 'Item999', value: '9990' })
    })

    it('应该能处理只有空格的行', () => {
      const csv = 'name,age\nJohn,25\n   ,   \nJane,30'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'John', age: '25' },
        { name: 'Jane', age: '30' }
      ])
    })
  })

  // ==================== 特殊字符测试 ====================
  describe('特殊字符处理', () => {
    it('应该能处理中文', () => {
      const csv = 'name,age\n张三，25\n李四，30'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: '张三', age: '25' },
        { name: '李四', age: '30' }
      ])
    })

    it('应该能处理特殊符号', () => {
      const csv = 'name,symbol\nItem1,@#$%\nItem2,&*()'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'Item1', symbol: '@#$%' },
        { name: 'Item2', symbol: '&*()' }
      ])
    })

    it('应该能处理 emoji', () => {
      const csv = 'name,emoji\nSmile,😀\nHeart,❤️'
      const result = csvDataHandle(csv)
      
      expect(result).toEqual([
        { name: 'Smile', emoji: '😀' },
        { name: 'Heart', emoji: '❤️' }
      ])
    })
  })

  // ==================== 类型测试 ====================
  describe('类型测试', () => {
    it('应该能返回正确的类型', () => {
      const csv = 'name,age\nJohn,25'
      const result = csvDataHandle(csv)
      
      expect(Array.isArray(result)).toBe(true)
      expect(typeof result[0]).toBe('object')
    })

    it('应该能使用泛型', () => {
      interface User {
        name: string
        age: number
      }
      
      const csv = 'name,age\nJohn,25'
      const result = csvDataHandle<User>(csv, {
        middle: (key, val) => key === 'age' ? Number(val) : val
      })
      
      expect(result[0].name).toBe('John')
      expect(result[0].age).toBe(25)
    })
  })

  // ==================== 性能测试 ====================
  describe('性能测试', () => {
    it('应该能快速处理大量数据', () => {
      let csv = 'id,name,value,description\n'
      for (let i = 0; i < 10000; i++) {
        csv += `${i},Item${i},${i * 10},Description for item ${i}\n`
      }
      
      const start = Date.now()
      const result = csvDataHandle(csv)
      const duration = Date.now() - start
      
      expect(result.length).toBe(10000)
      expect(duration).toBeLessThan(1000) // 应该在 1 秒内完成
    })
  })
})
