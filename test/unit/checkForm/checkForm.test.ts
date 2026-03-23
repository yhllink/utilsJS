import { checkForm } from '@/checkForm/checkForm'

describe('checkForm 模块测试', () => {
  beforeEach(() => {
    // 重置错误消息回调
    checkForm.setCheckFormMessage(() => {})
  })

  // ==================== 基础功能测试 ====================
  describe('基础功能', () => {
    it('应该能通过空表单验证', () => {
      const form = {}
      const rules = {}
      const result = checkForm(form, rules)
      
      expect(result.code).toBe(200)
    })

    it('应该能验证必填字段', () => {
      const form = { name: 'John' }
      const rules = { name: '姓名不能为空' }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(200)
    })

    it('应该能检测空值', () => {
      const form = { name: '' }
      const rules = { name: '姓名不能为空' }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(400)
      expect(result.message).toBe('姓名不能为空')
    })

    it('应该能检测 undefined', () => {
      const form = { name: undefined }
      const rules = { name: '姓名不能为空' }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(400)
    })

    it('应该能检测 null', () => {
      const form = { name: null }
      const rules = { name: '姓名不能为空' }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(400)
    })
  })

  // ==================== 手机号验证 ====================
  describe('手机号验证', () => {
    it('应该能验证正确的手机号', () => {
      const form = { phone: '13812345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(200)
    })

    it('应该能验证 13x 号段', () => {
      const form = { phone: '13812345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 14x 号段', () => {
      const form = { phone: '14012345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 15x 号段', () => {
      const form = { phone: '15012345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 16x 号段', () => {
      const form = { phone: '16012345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 17x 号段', () => {
      const form = { phone: '17012345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 18x 号段', () => {
      const form = { phone: '18012345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 19x 号段', () => {
      const form = { phone: '19012345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能拒绝错误的手机号', () => {
      const invalidPhones = [
        '12345678901', // 12x 号段不存在
        '1381234567',  // 少一位
        '138123456789', // 多一位
        'abc12345678',  // 包含字母
        '138-1234-5678', // 包含连字符
      ]
      
      invalidPhones.forEach(phone => {
        const form = { phone }
        const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
        expect(checkForm(form, rules).code).toBe(400)
      })
    })

    it('应该能验证带国际区号的手机号', () => {
      const form = { phone: '+8613812345678' }
      const rules = { phone: { type: 'phone', message: '手机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })
  })

  // ==================== 邮箱验证 ====================
  describe('邮箱验证', () => {
    it('应该能验证正确的邮箱', () => {
      const form = { email: 'test@example.com' }
      const rules = { email: { type: 'email', message: '邮箱格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证复杂邮箱', () => {
      const emails = [
        'user.name@example.com',
        'user+tag@example.com',
        'user_name@example.co.uk',
        '123456@example.com',
      ]
      
      emails.forEach(email => {
        const form = { email }
        const rules = { email: { type: 'email', message: '邮箱格式错误' } }
        expect(checkForm(form, rules).code).toBe(200)
      })
    })

    it('应该能验证带 IP 的邮箱', () => {
      const form = { email: 'user@[192.168.1.1]' }
      const rules = { email: { type: 'email', message: '邮箱格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能拒绝错误的邮箱', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user@.com',
        'user@example',
        'user name@example.com',
      ]
      
      invalidEmails.forEach(email => {
        const form = { email }
        const rules = { email: { type: 'email', message: '邮箱格式错误' } }
        expect(checkForm(form, rules).code).toBe(400)
      })
    })
  })

  // ==================== 座机号验证 ====================
  describe('座机号验证', () => {
    it('应该能验证带区号的座机号', () => {
      const form = { telephone: '010-12345678' }
      const rules = { telephone: { type: 'telephone', message: '座机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证不带区号的座机号', () => {
      const form = { telephone: '12345678' }
      const rules = { telephone: { type: 'telephone', message: '座机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 7 位座机号', () => {
      const form = { telephone: '1234567' }
      const rules = { telephone: { type: 'telephone', message: '座机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证 8 位座机号', () => {
      const form = { telephone: '12345678' }
      const rules = { telephone: { type: 'telephone', message: '座机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证带分机的座机号', () => {
      const form = { telephone: '010-12345678-1234' }
      const rules = { telephone: { type: 'telephone', message: '座机号格式错误' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能拒绝错误的座机号', () => {
      const invalidTelephones = [
        '123456',     // 太短
        '1234567890123456789', // 太长
        'abc-defg',   // 包含字母
      ]
      
      invalidTelephones.forEach(tel => {
        const form = { telephone: tel }
        const rules = { telephone: { type: 'telephone', message: '座机号格式错误' } }
        expect(checkForm(form, rules).code).toBe(400)
      })
    })
  })

  // ==================== 长度验证 ====================
  describe('长度验证', () => {
    it('应该能验证最小长度', () => {
      const form = { name: 'John' }
      const rules = { 
        name: { 
          type: String, 
          minLength: 3, 
          maxLength: 10,
          message: '长度不符合要求' 
        } 
      }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证最大长度', () => {
      const form = { name: 'JohnJohnJohn' }
      const rules = { 
        name: { 
          type: String, 
          minLength: 3, 
          maxLength: 5,
          message: '长度不符合要求' 
        } 
      }
      
      expect(checkForm(form, rules).code).toBe(400)
    })

    it('应该能验证数组长度', () => {
      const form = { items: [1, 2, 3] }
      const rules = { 
        items: { 
          type: Array, 
          minLength: 2, 
          maxLength: 5,
          message: '数量不符合要求' 
        } 
      }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能验证数字范围', () => {
      const form = { age: 25 }
      const rules = { 
        age: { 
          type: Number, 
          minLength: 18, 
          maxLength: 60,
          message: '年龄不符合要求' 
        } 
      }
      
      expect(checkForm(form, rules).code).toBe(200)
    })
  })

  // ==================== 自定义规则 ====================
  describe('自定义规则', () => {
    it('应该能使用自定义验证函数', () => {
      const form = { age: 25 }
      const rules = {
        age: {
          custom: (key, value) => {
            if (value < 18) return '必须年满 18 岁'
          }
        }
      }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('自定义规则应该能返回错误消息', () => {
      const form = { age: 15 }
      const rules = {
        age: {
          custom: (key, value) => {
            if (value < 18) return '必须年满 18 岁'
          }
        }
      }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(400)
      expect(result.message).toBe('必须年满 18 岁')
    })

    it('自定义规则应该能访问表单数据', () => {
      const form = { password: '123', confirmPassword: '456' }
      const rules = {
        confirmPassword: {
          custom: (key, value, formData) => {
            if (value !== formData.password) return '两次密码不一致'
          }
        }
      }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(400)
      expect(result.message).toBe('两次密码不一致')
    })
  })

  // ==================== 多规则验证 ====================
  describe('多规则验证', () => {
    it('应该能验证规则数组', () => {
      const form = { email: 'test@example.com' }
      const rules = {
        email: [
          { type: 'any', message: '邮箱不能为空' },
          { type: 'email', message: '邮箱格式错误' }
        ]
      }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能在任一规则通过时成功', () => {
      const form = { contact: '13812345678' }
      const rules = {
        contact: [
          { type: 'phone', message: '手机号格式错误' },
          { type: 'email', message: '邮箱格式错误' }
        ]
      }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该在所有规则都失败时返回错误', () => {
      const form = { contact: 'invalid' }
      const rules = {
        contact: [
          { type: 'phone', message: '手机号格式错误' },
          { type: 'email', message: '邮箱格式错误' }
        ]
      }
      
      const result = checkForm(form, rules)
      expect(result.code).toBe(400)
    })
  })

  // ==================== 边界条件测试 ====================
  describe('边界条件测试', () => {
    it('应该能处理空字符串', () => {
      const form = { name: '' }
      const rules = { name: { type: 'any', message: '不能为空' } }
      
      expect(checkForm(form, rules).code).toBe(400)
    })

    it('应该能处理 0', () => {
      const form = { count: 0 }
      const rules = { count: { type: Number, message: '必须是数字' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能处理 false', () => {
      const form = { active: false }
      const rules = { active: { type: Boolean, message: '必须是布尔值' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })

    it('应该能处理空数组', () => {
      const form = { items: [] }
      const rules = { items: { type: Array, message: '必须是数组' } }
      
      expect(checkForm(form, rules).code).toBe(200)
    })
  })

  // ==================== 错误消息回调测试 ====================
  describe('错误消息回调', () => {
    it('应该能调用错误消息回调', () => {
      const mockMessage = jest.fn()
      checkForm.setCheckFormMessage(mockMessage)
      
      const form = { name: '' }
      const rules = { name: '姓名不能为空' }
      
      checkForm(form, rules, true)
      
      expect(mockMessage).toHaveBeenCalledWith('姓名不能为空')
    })

    it('应该能关闭自动 toast', () => {
      const mockMessage = jest.fn()
      checkForm.setCheckFormMessage(mockMessage)
      
      const form = { name: '' }
      const rules = { name: '姓名不能为空' }
      
      checkForm(form, rules, false)
      
      expect(mockMessage).not.toHaveBeenCalled()
    })
  })
})
