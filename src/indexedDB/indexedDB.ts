const dbList: { DBname: string; version: number }[] = []
const dbWeakMap = new WeakMap()

type StoreConfigType = { keyPath: string; keys: { [key: string]: { unique: boolean } } }

type ObjectStoreConfigType = { [key: string]: StoreConfigType }
let ObjectStoreConfig: ObjectStoreConfigType = Object.freeze({})

class IndexedDB {
  private DB?: IDBDatabase
  private DBname: string
  private version: number

  static hasDB(): boolean {
    if (typeof window === 'undefined') return false
    return !!window?.indexedDB
  }
  static initConfig(storeName: string, config: StoreConfigType) {
    if (ObjectStoreConfig[storeName]) {
      if (JSON.stringify(config) !== JSON.stringify(ObjectStoreConfig[storeName])) {
        return console.error('IndexedDB ' + storeName + ' 仓库已存在')
      }
    }

    ObjectStoreConfig = Object.freeze({ ...ObjectStoreConfig, [storeName]: config })
    return true
  }

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
  public async getTransaction(mode: IDBTransactionMode) {
    const DB = await this.getDB()
    if (!DB) return false

    return DB.transaction([this.DBname], mode)
  }
  public async getStore(mode: IDBTransactionMode) {
    const transaction = await this.getTransaction(mode)
    if (!transaction) return false

    return transaction.objectStore(this.DBname)
  }

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
