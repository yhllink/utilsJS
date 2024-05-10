const dbList: { DBname: string; version: number }[] = []
const dbWeakMap = new WeakMap()

type StoreConfigType = { keyPath: string; keys: { [key: string]: { unique: boolean } } }

let ObjectStoreConfig: { [key: string]: StoreConfigType } = Object.freeze({})

class IndexedDB {
  private DB?: IDBDatabase
  private DBname: string
  private version: number

  /**
   * 判断当前是否支持IndexedDB
   * @returns {boolean}
   */
  static hasDB(): boolean {
    if (typeof window === 'undefined') return false
    return !!window?.indexedDB
  }

  /**
   * 初始化仓库参数
   * @param {string} storeName 仓库名称
   * @param {StoreConfigType} config 仓库配置参数
   * @returns
   */
  static initConfig(storeName: string, config: StoreConfigType) {
    if (ObjectStoreConfig[storeName]) {
      if (JSON.stringify(config) !== JSON.stringify(ObjectStoreConfig[storeName])) {
        return console.error('IndexedDB ' + storeName + ' 仓库已存在')
      }
    }

    ObjectStoreConfig = Object.freeze({ ...ObjectStoreConfig, [storeName]: config })
    return true
  }

  /**
   * 创建仓库
   * @param {string} DBname 仓库名称
   * @param {number} version 仓库版本
   * @returns
   */
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

  private checkParams(data: Object): boolean {
    // @ts-ignore
    const config = ObjectStoreConfig[this.DBname] || {}

    const needKeys = new Set(Object.keys(config?.keys || {}))
    const hasKeys = Object.keys(data || {})

    for (let i = 0, l = hasKeys.length; i < l; i++) {
      if (!needKeys.has(hasKeys[i])) return false
    }

    return true
  }

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

  /**
   * 获取事务
   * @param {IDBTransactionMode} mode 事务连接类型
   * @returns 事物实例
   */
  public async getTransaction(mode: IDBTransactionMode) {
    const DB = await this.getDB()
    if (!DB) return false

    return DB.transaction([this.DBname], mode)
  }

  /**
   * 获取仓库
   * @param {IDBTransactionMode} mode 仓库连接类型
   * @returns 仓库实例
   */
  public async getStore(mode: IDBTransactionMode) {
    const transaction = await this.getTransaction(mode)
    if (!transaction) return false

    return transaction.objectStore(this.DBname)
  }

  /**
   * 删除仓库
   * @returns {Promise<boolean>}
   */
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

  /**
   * 清空仓库数据
   * @returns {Promise<boolean>}
   */
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

  /**
   * 添加数据 // 只写权限
   * @param {{ [key: string]: any } data 要添加的数据
   * @returns {Promise<boolean>}
   */
  public async add(data: { [key: string]: any }): Promise<any> {
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

  /**
   * 删除数据 // 读写权限
   * @param {string | number} keyPath 仓库对应行主键
   * @returns {Promise<boolean>}
   */
  public async delete(keyPath: string | number): Promise<any> {
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

  /**
   * 修改数据 // 读写权限
   * @param {{ [key: string]: any }} data 要修改的数据
   * @returns {Promise<boolean>}
   */
  public async put(data: { [key: string]: any }): Promise<any> {
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

  /**
   * 查询数据 // 只读权限
   * @param {string | number} keyPath 仓库对应行主键
   * @returns {Promise<any>}
   */
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

  /**
   * 主键指针对象查询数据 // 只读权限
   * @param {(key: string) => Promise<boolean> | boolean} query 查询条件
   * @returns {Promise<any>}
   */
  public async queryKey(query: (key: string) => Promise<boolean> | boolean): Promise<any> {
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

  /**
   * 指针对象查询数据 // 只读权限
   * @param {(key: string, val: any) => Promise<boolean> | boolean} query 查询条件
   * @returns {Promise<any>}
   */
  public async query(query: (key: string, val: any) => Promise<boolean> | boolean): Promise<any> {
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

export default IndexedDB
