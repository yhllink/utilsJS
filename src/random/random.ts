export function random() {
  return Number(Date.now() + '' + Math.floor(Math.random() * 100000)).toString(36)
}
