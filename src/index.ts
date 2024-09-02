import loadModules from './loadModules/loadModules'
import yUtils from './export'

type yUtilsType = typeof yUtils
type yUtilsKey = keyof yUtilsType

type ReturnUtils<T extends yUtilsKey> = ReturnType<yUtilsType[T]>
type AwaitReturnUtils<T extends yUtilsKey> = Awaited<ReturnUtils<T>>
type ModulesType<T extends yUtilsKey> = string & keyof Awaited<ReturnUtils<T>>

function YUtils<T extends yUtilsKey>(name: T): Promise<AwaitReturnUtils<T>>
function YUtils<T extends yUtilsKey, K extends ModulesType<T>>(name: T, modules: K): Promise<AwaitReturnUtils<T>[K]>
function YUtils<T extends yUtilsKey, K extends ModulesType<T>>(name: T, modules?: K): any {
  return loadModules(yUtils[name], { modules })
}
export default YUtils
