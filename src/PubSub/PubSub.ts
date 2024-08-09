type Event = Exclude<any, null | undefined>
type CallbackType = (...i: any) => void

const events = new Map<string, { callback: CallbackType; once: boolean }[]>() // 使用 Map 存储事件及其回调函数

export function subscribe(eventName: Event, callback: CallbackType, once = false) {
  if (!events.has(eventName)) {
    events.set(eventName, [])
  }

  const event = events.get(eventName)
  if (!event) return

  // 添加回调函数到事件数组中
  event.push({ callback, once })
}

export function publish(eventName: Event, data: any) {
  const subscribers = events.get(eventName)
  if (!subscribers) return

  // 遍历事件的回调函数并触发
  for (let i = 0; i < subscribers.length; i++) {
    const { callback, once } = subscribers[i]

    callback(data)
    // 如果是一次性订阅，则触发后移除该订阅
    if (once) {
      unsubscribe(eventName, callback)
      i-- // 因为移除了一个元素，需要调整索引
    }
  }
}

export function unsubscribe(eventName: Event, callback: CallbackType) {
  const subscribers = events.get(eventName)
  if (!subscribers) return

  // 找到需要取消的订阅回调函数并移除
  const filteredSubscribers = subscribers.filter((subscriber) => subscriber.callback !== callback)
  if (filteredSubscribers.length > 0) {
    events.set(eventName, filteredSubscribers)
  } else {
    events.delete(eventName) // 如果没有订阅者了，就删除该事件
  }
}

export default { subscribe, publish, unsubscribe }
