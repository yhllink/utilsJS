const csvDataHandle = function <T>(
  csv: string,
  option?: { keysObj?: { [key: string]: string }; middle?: (key: string, val: string) => any; filter?: (item: AnyObj) => boolean }
) {
  const csvList = csv.split('\n')

  const arr: AnyObj[] = []

  const keys = csvList[0].split(',')
  for (let i = 1, l = csvList.length; i < l; i++) {
    const item = csvList[i].split(',')

    const obj: AnyObj = {}
    for (let j = 0, l = keys.length; j < l; j++) {
      const key = option?.keysObj?.[keys[j]] || keys[j]
      obj[key] = option?.middle ? option.middle(key, item[j]) : item[j].trim()
    }
    if (option?.filter) {
      if (!option.filter(obj)) continue
    }

    if (Object.keys(obj).length) arr.push(obj)
  }

  return arr as T[]
}
export default csvDataHandle
