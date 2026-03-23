import { bubbleSort } from '@/bubbleSort/bubbleSort'
import { quickSort } from '@/quickSort/quickSort'
import { mergeSort } from '@/mergeSort/mergeSort'

describe('排序算法模块测试', () => {
  // ==================== bubbleSort 测试 ====================
  describe('bubbleSort 冒泡排序', () => {
    it('应该能排序空数组', () => {
      expect(bubbleSort([])).toEqual([])
    })

    it('应该能排序单个元素', () => {
      expect(bubbleSort([1])).toEqual([1])
    })

    it('应该能排序已排序的数组', () => {
      expect(bubbleSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('应该能排序逆序数组', () => {
      expect(bubbleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('应该能排序乱序数组', () => {
      expect(bubbleSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('应该能排序包含负数的数组', () => {
      expect(bubbleSort([3, -1, 0, -5, 2])).toEqual([-5, -1, 0, 2, 3])
    })

    it('应该能排序包含小数的数组', () => {
      expect(bubbleSort([3.14, 2.71, 1.41, 0.5])).toEqual([0.5, 1.41, 2.71, 3.14])
    })

    it('应该能排序包含重复元素的数组', () => {
      expect(bubbleSort([5, 2, 5, 1, 2, 5])).toEqual([1, 2, 2, 5, 5, 5])
    })

    it('不应该修改原数组', () => {
      const original = [3, 1, 2]
      const copy = [...original]
      bubbleSort(original)
      expect(original).toEqual(copy)
    })

    it('应该能使用 getVal 回调排序对象数组', () => {
      const arr = [
        { val: 3 },
        { val: 1 },
        { val: 2 }
      ]
      const sorted = bubbleSort(arr, (item) => item.val)
      expect(sorted).toEqual([
        { val: 1 },
        { val: 2 },
        { val: 3 }
      ])
    })

    it('应该能使用 getVal 回调排序复杂对象', () => {
      const arr = [
        { user: { age: 30 } },
        { user: { age: 20 } },
        { user: { age: 25 } }
      ]
      const sorted = bubbleSort(arr, (item) => item.user.age)
      expect(sorted).toEqual([
        { user: { age: 20 } },
        { user: { age: 25 } },
        { user: { age: 30 } }
      ])
    })
  })

  // ==================== quickSort 测试 ====================
  describe('quickSort 快速排序', () => {
    it('应该能排序空数组', () => {
      expect(quickSort([])).toEqual([])
    })

    it('应该能排序单个元素', () => {
      expect(quickSort([1])).toEqual([1])
    })

    it('应该能排序已排序的数组', () => {
      expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('应该能排序逆序数组', () => {
      expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('应该能排序乱序数组', () => {
      expect(quickSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('应该能排序包含负数的数组', () => {
      expect(quickSort([3, -1, 0, -5, 2])).toEqual([-5, -1, 0, 2, 3])
    })

    it('应该能排序包含小数的数组', () => {
      expect(quickSort([3.14, 2.71, 1.41, 0.5])).toEqual([0.5, 1.41, 2.71, 3.14])
    })

    it('应该能排序包含重复元素的数组', () => {
      expect(quickSort([5, 2, 5, 1, 2, 5])).toEqual([1, 2, 2, 5, 5, 5])
    })

    it('不应该修改原数组', () => {
      const original = [3, 1, 2]
      const copy = [...original]
      quickSort(original)
      expect(original).toEqual(copy)
    })

    it('应该能使用 getVal 回调排序对象数组', () => {
      const arr = [
        { val: 3 },
        { val: 1 },
        { val: 2 }
      ]
      const sorted = quickSort(arr, (item) => item.val)
      expect(sorted).toEqual([
        { val: 1 },
        { val: 2 },
        { val: 3 }
      ])
    })

    it('应该能处理大型数组', () => {
      const arr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000))
      const sorted = quickSort(arr)
      const expected = [...arr].sort((a, b) => a - b)
      expect(sorted).toEqual(expected)
    })
  })

  // ==================== mergeSort 测试 ====================
  describe('mergeSort 归并排序', () => {
    it('应该能排序空数组', () => {
      expect(mergeSort([])).toEqual([])
    })

    it('应该能排序单个元素', () => {
      expect(mergeSort([1])).toEqual([1])
    })

    it('应该能排序已排序的数组', () => {
      expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    it('应该能排序逆序数组', () => {
      expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5])
    })

    it('应该能排序乱序数组', () => {
      expect(mergeSort([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 1, 2, 3, 4, 5, 6, 9])
    })

    it('应该能排序包含负数的数组', () => {
      expect(mergeSort([3, -1, 0, -5, 2])).toEqual([-5, -1, 0, 2, 3])
    })

    it('应该能排序包含小数的数组', () => {
      expect(mergeSort([3.14, 2.71, 1.41, 0.5])).toEqual([0.5, 1.41, 2.71, 3.14])
    })

    it('应该能排序包含重复元素的数组', () => {
      expect(mergeSort([5, 2, 5, 1, 2, 5])).toEqual([1, 2, 2, 5, 5, 5])
    })

    it('不应该修改原数组', () => {
      const original = [3, 1, 2]
      const copy = [...original]
      mergeSort(original)
      expect(original).toEqual(copy)
    })

    it('应该能使用 getVal 回调排序对象数组', () => {
      const arr = [
        { val: 3 },
        { val: 1 },
        { val: 2 }
      ]
      const sorted = mergeSort(arr, (item) => item.val)
      expect(sorted).toEqual([
        { val: 1 },
        { val: 2 },
        { val: 3 }
      ])
    })

    it('应该能处理大型数组', () => {
      const arr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000))
      const sorted = mergeSort(arr)
      const expected = [...arr].sort((a, b) => a - b)
      expect(sorted).toEqual(expected)
    })
  })

  // ==================== 排序算法对比测试 ====================
  describe('排序算法对比', () => {
    it('三种排序算法应该产生相同结果', () => {
      const arr = [64, 34, 25, 12, 22, 11, 90]
      const bubbleResult = bubbleSort(arr)
      const quickResult = quickSort(arr)
      const mergeResult = mergeSort(arr)
      
      expect(bubbleResult).toEqual(quickResult)
      expect(quickResult).toEqual(mergeResult)
    })

    it('应该都能处理相同数组多次排序', () => {
      const arr = [5, 2, 8, 1, 9]
      
      expect(bubbleSort(arr)).toEqual(bubbleSort(arr))
      expect(quickSort(arr)).toEqual(quickSort(arr))
      expect(mergeSort(arr)).toEqual(mergeSort(arr))
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    const testCases = [
      { name: '全零数组', arr: [0, 0, 0, 0] },
      { name: '全负数数组', arr: [-5, -2, -8, -1] },
      { name: 'Infinity 数组', arr: [Infinity, -Infinity, 0, 1] },
      { name: 'NaN 数组', arr: [3, NaN, 1, 2] },
    ]

    testCases.forEach(({ name, arr }) => {
      it(`应该能处理${name}`, () => {
        const bubbleResult = bubbleSort([...arr])
        const quickResult = quickSort([...arr])
        const mergeResult = mergeSort([...arr])
        
        // 至少不应该抛出错误
        expect(Array.isArray(bubbleResult)).toBe(true)
        expect(Array.isArray(quickResult)).toBe(true)
        expect(Array.isArray(mergeResult)).toBe(true)
      })
    })
  })

  // ==================== 性能测试 ====================
  describe('性能测试', () => {
    it('bubbleSort 应该在合理时间内完成小型数组', () => {
      const arr = Array.from({ length: 100 }, () => Math.random())
      const start = Date.now()
      bubbleSort(arr)
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000) // 1 秒内完成
    })

    it('quickSort 应该在合理时间内完成中型数组', () => {
      const arr = Array.from({ length: 1000 }, () => Math.random())
      const start = Date.now()
      quickSort(arr)
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000)
    })

    it('mergeSort 应该在合理时间内完成中型数组', () => {
      const arr = Array.from({ length: 1000 }, () => Math.random())
      const start = Date.now()
      mergeSort(arr)
      const duration = Date.now() - start
      
      expect(duration).toBeLessThan(1000)
    })
  })
})
