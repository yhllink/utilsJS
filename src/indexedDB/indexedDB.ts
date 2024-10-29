import { isServer } from '@/isServer/isServer'

// 定义一个数组来保存数据库列表
const dbList: { DBname: string; version: number }[] = []
// 使用 WeakMap 来保存数据库实例
const dbWeakMap = new WeakMap()

// 定义仓库配置类型
type StoreConfigType = {
  keyPath: string
  keys: { [key: string]: { unique: boolean } }
}

// 冻结仓库配置对象以避免修改
let ObjectStoreConfig: { [key: string]: StoreConfigType } = Object.freeze({})

// IndexedDB 类
class IndexedDB {
  private DB?: IDBDatabase // 私有属性，用于保存数据库实例
  private DBname: string // 数据库名称
  private version: number // 数据库版本

  // 静态方法，判断当前环境是否支持 IndexedDB
  static hasDB(): boolean {
    if (isServer) return false
    return !!window?.indexedDB
  }

  // 初始化仓库参数的静态方法
  static initConfig(storeName: string, config: StoreConfigType) {
    if (ObjectStoreConfig[storeName]) {
      if (JSON.stringify(config) !== JSON.stringify(ObjectStoreConfig[storeName])) {
        return console.error('IndexedDB ' + storeName + ' 仓库已存在')
      }
    }

    ObjectStoreConfig = Object.freeze({ ...ObjectStoreConfig, [storeName]: config })
    return true
  }

  // 构造函数，用于创建 IndexedDB 实例
  constructor(DBname: string, version: number = 1) {
    if (!Object.prototype.hasOwnProperty.call(ObjectStoreConfig, DBname)) {
      throw new Error(`没有配置 数据库 ${DBname}`)
    }

    this.DBname = DBname
    this.version = version

    let dbItem = dbList.find((i) => i.DBname === DBname && i.version === version)
    if (!dbItem) {
      dbItem = { DBname, version }
      dbList.push(dbItem)
    }

    const db = dbWeakMap.get(dbItem)
    if (db) return db

    dbWeakMap.set(dbItem, this)
  }

  // 检查传入数据是否符合配置要求的私有方法
  private checkParams(data: Object): boolean {
    const config = ObjectStoreConfig[this.DBname] || {}

    const needKeys = new Set(Object.keys(config?.keys || {}))
    const hasKeys = Object.keys(data || {})

    for (let i = 0, l = hasKeys.length; i < l; i++) {
      if (!needKeys.has(hasKeys[i])) return false
    }

    return true
  }

  // 获取或打开数据库的私有方法
  private getDB(): Promise<false | IDBDatabase> {
    return new Promise((resolve) => {
      if (this.DB) return resolve(this.DB)

      const that = this
      const DB = window.indexedDB.open(this.DBname, this.version)

      DB.onerror = function (event) {
        resolve(false)
      }
      DB.onsuccess = function (event) {
        that.DB = DB.result
        resolve(that.DB)
      }
      DB.onupgradeneeded = function (event: any) {
        if (!event.target?.result?.objectStoreNames?.contains) return

        // 如果数据库已存在
        if (event.target.result.objectStoreNames.contains(that.DBname)) return

        // @ts-ignore
        const ObjectStore = ObjectStoreConfig[that.DBname]

        // 创建person仓库(表) 主键
        const Store = event.target.result.createObjectStore(that.DBname, {
          keyPath: ObjectStore.keyPath,
        })

        if (typeof ObjectStore.keys === 'object') {
          for (const key in ObjectStore.keys) {
            Store.createIndex(key, key, ObjectStore.keys[key])
          }
        }
      }
    })
  }

  // 获取事务的公共异步方法
  public async getTransaction(mode: IDBTransactionMode) {
    const DB = await this.getDB()
    if (!DB) return false

    return DB.transaction([this.DBname], mode)
  }

  // 获取对象存储的公共异步方法
  public async getStore(mode: IDBTransactionMode) {
    const transaction = await this.getTransaction(mode)
    if (!transaction) return false

    return transaction.objectStore(this.DBname)
  }

  // 删除数据库的公共异步方法
  public async delDB(): Promise<boolean> {
    const DB = await this.getStore('readonly')
    if (!DB) return false

    return new Promise((resolve) => {
      const deleteRequest = window.indexedDB.deleteDatabase(this.DBname)

      deleteRequest.onsuccess = function () {
        resolve(true)
      }

      deleteRequest.onerror = function () {
        resolve(false)
      }
    })
  }

  // 清空对象存储的公共异步方法
  public async clear(): Promise<boolean> {
    const DB = await this.getStore('readwrite')
    if (!DB) return false

    return new Promise((resolve) => {
      // 删除对象存储
      var request = DB.clear()

      request.onsuccess = function () {
        resolve(true)
      }

      request.onerror = function () {
        resolve(false)
      }
    })
  }

  // 添加数据的公共异步方法（只写权限）
  public async add(data: { [key: string]: any }): Promise<boolean> {
    if (!Object.keys(data || {}).length) {
      console.error('参数检查失败 参数不能为空')
      return false
    }

    if (!this.checkParams(data)) {
      console.error('参数检查失败 必须使用配置项中携带的参数')
      return false
    }

    const DB = await this.getStore('readwrite')
    if (!DB) return false

    return new Promise((resolve) => {
      // 查询表
      const request = DB.add(data)

      // 监听查询成功
      request.onsuccess = function (event) {
        resolve(true)
      }
      // 监听查询失败
      request.onerror = function (event) {
        // @ts-ignore
        console.log('Database error: ', event.target.error)
        resolve(false)
      }
    })
  }

  // 删除数据的公共异步方法（读写权限）
  public async delete(keyPath: string | number): Promise<boolean> {
    const DB = await this.getStore('readwrite')
    if (!DB) return false

    return new Promise((resolve) => {
      // 查询表
      const request = DB.delete(keyPath)

      // 监听查询成功
      request.onsuccess = function (event) {
        resolve(true)
      }
      // 监听查询失败
      request.onerror = function (event) {
        // @ts-ignore
        console.log('Database error: ', event.target.error)
        resolve(false)
      }
    })
  }

  // 修改数据的公共异步方法（读写权限）
  public async put(data: { [key: string]: any }): Promise<boolean> {
    if (!Object.keys(data || {}).length) {
      console.error('参数检查失败 参数不能为空')
      return false
    }

    if (!this.checkParams(data)) {
      console.error('参数检查失败 必须使用配置项中携带的参数')
      return false
    }

    const DB = await this.getStore('readwrite')
    if (!DB) return false

    return new Promise((resolve) => {
      // 查询表
      const request = DB.put(data)

      // 监听查询成功
      request.onsuccess = function (event) {
        resolve(true)
      }
      // 监听查询失败
      request.onerror = function (event) {
        // @ts-ignore
        console.log('Database error: ', event.target.error)
        resolve(false)
      }
    })
  }

  // 查询数据的公共异步方法（只读权限）
  public async get(keyPath: string | number): Promise<any> {
    const DB = await this.getStore('readonly')
    if (!DB) return false

    return new Promise((resolve) => {
      // 查询表
      const request = DB.get(keyPath)

      // 监听查询成功
      request.onsuccess = function (event) {
        // @ts-ignore
        resolve(event.target.result)
      }
      // 监听查询失败
      request.onerror = function (event) {
        // @ts-ignore
        console.log('Database error: ', event.target.error)
        resolve(false)
      }
    })
  }

  // 主键指针对象查询数据的公共异步方法（只读权限）
  public async queryKey(query: (key: string) => Promise<boolean> | boolean): Promise<string[] | boolean> {
    const DB = await this.getStore('readonly')
    if (!DB) return false

    return new Promise((resolve) => {
      // 查询表
      const request = DB.openKeyCursor()

      const queryList: string[] = []

      // 监听查询成功
      request.onsuccess = async function (event) {
        // @ts-ignore
        const cursor = event?.target?.result
        if (cursor) {
          const hit = await query(cursor.key)
          if (hit) queryList.push(cursor.key)
          cursor.continue()
        } else {
          resolve(queryList)
        }
      }
      // 监听查询失败
      request.onerror = function (event) {
        // @ts-ignore
        console.log('Database error: ', event.target.error)
        resolve(false)
      }
    })
  }

  // 指针对象查询数据的公共异步方法（只读权限）
  public async query(query: (key: string, val: any) => Promise<boolean> | boolean): Promise<any[] | boolean> {
    const DB = await this.getStore('readonly')
    if (!DB) return false

    return new Promise((resolve) => {
      // 查询表
      const request = DB.openCursor()

      const queryList: any[] = []

      // 监听查询成功
      request.onsuccess = async function (event) {
        // @ts-ignore
        const cursor = event?.target?.result

        if (cursor) {
          const hit = await query(cursor.key, cursor.value)
          if (hit) queryList.push(cursor.value)
          cursor.continue()
        } else {
          resolve(queryList)
        }
      }
      // 监听查询失败
      request.onerror = function (event) {
        // @ts-ignore
        console.log('Database error: ', event.target.error)
        resolve(false)
      }
    })
  }
}

// 导出 IndexedDB 类
export { IndexedDB }
