import number2Chinese from '../number2Chinese/number2Chinese'

export default function number2ChineseWeek(week: number) {
  const weekNum = week % 7
  return weekNum === 0 ? '天' : number2Chinese(weekNum)
}
