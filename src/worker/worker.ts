/**
 * 生成一个可在Worker中执行的字符串，包含函数及其初始化数据
 * @param fn 字符串或函数，表示要在Worker中执行的代码或函数
 * @param initData 传递给Worker函数的初始化数据
 * @returns 返回一个字符串，该字符串可在Worker中执行
 */
function getWorkerStr(fn: string | Function, ...initData: any[]) {
  // 将函数转换为字符串，并将初始化数据编码为JSON字符串，以便在Worker中使用
  return `;(${fn.toString()})(${initData.map((i) => JSON.stringify(i))})`
}

/**
 * 创建一个Worker，并使其执行指定的函数
 * @param fn 字符串或函数，表示要在Worker中执行的代码或函数
 * @param initData 传递给Worker函数的初始化数据
 * @returns 返回创建的Worker对象
 */
export function createWorker(fn: string | Function, ...initData: any[]): { workerStr: string } & Worker {
  const workerStr = getWorkerStr(fn, ...initData) // 获取Worker中可执行的字符串
  const worker = new Worker(URL.createObjectURL(new Blob([workerStr]))) // 根据执行字符串创建Worker对象
  // @ts-ignore
  worker.workerStr = workerStr // 将生成的Worker字符串保存在worker对象上，方便后续使用
  // @ts-ignoreF
  return worker // 返回创建的Worker对象
}

/**
 * 在Worker中运行指定的函数，并返回一个Promise，该Promise将解析为函数的结果
 * @param fn 要在Worker中执行的函数
 * @param initData 传递给Worker函数的初始化数据（可选）
 * @returns 返回一个Promise，该Promise将解析为函数的结果或拒绝原因
 */
export function runWorker(fn: Function, initData?: any) {
  return new Promise((resolve, reject) => {
    const workerStr = getWorkerStr(fn, initData).slice(1) // 获取Worker中可执行的字符串，并去除开头的分号
    // 创建一个Worker，使其执行封装后的函数
    const worker = createWorker(
      `function () {
      self.onmessage = function (e) {
        if (e.data !== 'onload') return
        Promise.resolve((function(self){return ${workerStr}})()).then(
          function (res){ self.postMessage({type:'resolve',data:res}) },
          function (err){ self.postMessage({type:'reject',data:err}) }
        )
      }
    }`
    )

    // 监听Worker的消息事件，以处理函数执行的结果或错误
    worker.addEventListener('message', function (e) {
      if (e.data.type === 'resolve') {
        resolve(e.data.data) // 如果是解析结果，则调用Promise的resolve，并终止Worker
        worker.terminate()
      }
      if (e.data.type === 'reject') {
        reject(e.data.data) // 如果是拒绝原因，则调用Promise的reject，并终止Worker
        worker.terminate()
      }
    })
    // 向Worker发送一个'onload'消息，以触发函数的执行
    worker.postMessage('onload')
  })
}
