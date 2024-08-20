/**
 * 获取设备的设备像素比（DPR）
 * 如果没有提供字符串参数，则返回DPR值
 * 如果提供了字符串参数，则将其中的{dpr}占位符替换为DPR值
 *
 * @param {string} [str] 可选参数，用于替换的字符串，包含占位符{dpr}
 * @returns {string | number} 返回DPR值或替换后的字符串
 */
function devicePixelRatio(): number
function devicePixelRatio(str: string): string
function devicePixelRatio(str?: string) {
  // 如果没有提供字符串参数，则直接返回设备的像素比，如果未定义则默认为1
  if (!str) return window.devicePixelRatio || 1
  // 如果提供了字符串参数，则将其中的{dpr}占位符替换为设备的像素比的字符串表示
  return str.replaceAll('{dpr}', window.devicePixelRatio.toString() || '1')
}
export default devicePixelRatio
