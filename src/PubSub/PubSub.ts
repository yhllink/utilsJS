// 定义事件类型，排除可能的null或undefined值
type Event = Exclude<any, null | undefined>
// 定义回调函数类型，接受任意数量的参数，无返回值
type CallbackType = (...i: any) => void

// 使用Map数据结构存储事件和其对应的回调函数列表
const events = new Map<string, { callback: CallbackType; once: boolean }[]>()

/**
 * 订阅事件
 * @param eventName 事件名称
 * @param callback 事件回调函数
 * @param once 是否仅触发一次，默认为false
 * @returns 取消订阅的函数
 */
export function subscribe(eventName: Event, callback: CallbackType, once = false) {
  // 如果事件列表中不存在该事件，则初始化一个空数组
  if (!events.has(eventName)) {
    events.set(eventName, [])
  }

  // 获取当前事件的订阅列表
  const event = events.get(eventName)
  if (!event) return

  // 将新的回调函数添加到订阅列表中
  event.push({ callback, once })

  // 返回一个取消订阅的函数
  return () => unsubscribe(eventName, callback)
}

/**
 * 发布事件
 * @param eventName 事件名称
 * @param data 事件数据
 */
export function publish(eventName: Event, data: any) {
  // 获取事件的订阅者列表
  const subscribers = events.get(eventName)
  if (!subscribers) return

  // 遍历订阅者列表，调用回调函数
  for (let i = 0; i < subscribers.length; i++) {
    const { callback, once } = subscribers[i]

    // 触发回调函数
    callback(data)
    // 如果是仅一次的订阅，则取消订阅
    if (once) {
      unsubscribe(eventName, callback)
      // 调整索引，因为取消订阅会移除回调函数
      i--
    }
  }
}

/**
 * 取消订阅事件
 * @param eventName 事件名称
 * @param callback 需要取消的回调函数
 */
export function unsubscribe(eventName: Event, callback: CallbackType) {
  // 获取事件的订阅者列表
  const subscribers = events.get(eventName)
  if (!subscribers) return

  // 过滤掉需要取消的回调函数
  const filteredSubscribers = subscribers.filter((subscriber) => subscriber.callback !== callback)
  // 如果还有其他回调函数，则更新订阅者列表
  if (filteredSubscribers.length > 0) {
    events.set(eventName, filteredSubscribers)
  } else {
    // 如果没有其他回调函数，则删除该事件
    events.delete(eventName)
  }
}
