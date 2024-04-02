/**
 * 获取设备dpr
 * @param str 用于替换的字符串 替换标识 {dpr}
 * @returns string
 */
function devicePixelRatio(str?: string) {
  if (!str) return window.devicePixelRatio || 1
  return str.replaceAll('{dpr}', window.devicePixelRatio.toString() || '1')
}
export default devicePixelRatio
