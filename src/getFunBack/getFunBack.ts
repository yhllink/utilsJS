/**
 * 该函数用于处理各种类型的返回值，确保最终返回一个Promise对象。
 * 主要用于统一异步操作的返回值处理，提高代码的可维护性和可读性。
 *
 * @param data - 任意类型的输入数据，可以是函数、Promise或其他类型。
 * @returns 返回一个Promise对象，其解析或拒绝的结果取决于输入数据的类型。
 */
export function getFunBack<T = any>(data: any): Promise<T> {
  // 检查输入数据是否为函数类型。
  if (typeof data === 'function') {
    // 如果是函数类型，立即调用该函数，并将其返回值传递给getFunBack处理。
    return getFunBack(data())
  }

  // 检查输入数据是否为Promise对象。
  if (data instanceof Promise) {
    // 如果是Promise对象
    return data
  }

  // 对于非函数和非Promise类型的输入数据，直接解析并返回。
  return Promise.resolve(data)
}
