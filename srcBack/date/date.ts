type DateType = string | number | LightDate | Date
type ComputeType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'

/**
 * LightDate 类用于处理日期和时间相关操作，包括日期格式化、比较和时间增减等。
 */
class LightDate {
  private dataDate: Date

  /**
   * 构造函数，初始化 LightDate 实例的日期。
   * @param dataDate 可以是字符串、数字或 Date 对象，表示初始日期。
   */
  constructor(dataDate?: DateType) {
    if (typeof dataDate === 'undefined') {
      this.dataDate = new Date()
    } else if (typeof dataDate === 'string' || typeof dataDate === 'number' || dataDate instanceof Date) {
      this.dataDate = new Date(dataDate)
    } else {
      this.dataDate = dataDate.getDate()
    }
  }

  /**
   * 获取与内部日期相同的新的 Date 对象。
   * @returns 返回一个新的 Date 对象，与内部日期相同。
   */
  public getDate() {
    return new Date(this.dataDate)
  }

  /**
   * 获取内部日期的时间戳。
   * @returns 返回内部日期的时间戳（毫秒）。
   */
  public getTime() {
    return this.dataDate.getTime()
  }

  /**
   * 获取内部日期的年份。
   * @returns 返回内部日期的年份。
   */
  public getFullYear() {
    return this.dataDate.getFullYear()
  }

  /**
   * 获取内部日期的月份。
   * @returns 返回内部日期的月份，注意月份是从 0 开始的，所以需要加 1。
   */
  public getMonth() {
    return this.dataDate.getMonth() + 1
  }

  /**
   * 获取内部日期的日。
   * @returns 返回内部日期的日。
   */
  public getDay() {
    return this.dataDate.getDate()
  }

  /**
   * 获取内部日期的小时。
   * @returns 返回内部日期的小时。
   */
  public getHours() {
    return this.dataDate.getHours()
  }

  /**
   * 获取内部日期的分钟。
   * @returns 返回内部日期的分钟。
   */
  public getMinutes() {
    return this.dataDate.getMinutes()
  }

  /**
   * 获取内部日期的秒。
   * @returns 返回内部日期的秒。
   */
  public getSeconds() {
    return this.dataDate.getSeconds()
  }

  /**
   * 获取内部日期的毫秒。
   * @returns 返回内部日期的毫秒。
   */
  public getMilliseconds() {
    return this.dataDate.getMilliseconds()
  }

  /**
   * 将内部日期转换为一个包含年、月、日、时、分、秒、毫秒的对象。
   * @returns 返回一个对象，包含年、月、日、时、分、秒、毫秒。
   */
  public toObject() {
    return {
      year: this.getFullYear(),
      month: this.getMonth(),
      day: this.getDay(),
      hour: this.getHours(),
      minute: this.getMinutes(),
      second: this.getSeconds(),
      millisecond: this.getMilliseconds(),
    }
  }

  /**
   * 根据指定的格式字符串格式化内部日期。
   * @param format 格式字符串，包含年(YYYY, YY), 月(MM, M), 日(DD, D), 时(HH, H), 分(mm, m), 秒(ss, s), 毫秒(SSS, SS, S)的占位符。
   * @returns 返回格式化后的日期字符串。
   */
  public format(format: string) {
    const { year, month, day, hour, minute, second, millisecond } = this.toObject()

    return format
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(2))
      .replace(/MM/g, month.toString().padStart(2, '0'))
      .replace(/M/g, month.toString().padStart(1, '0'))
      .replace(/DD/g, day.toString().padStart(2, '0'))
      .replace(/D/g, day.toString().padStart(1, '0'))
      .replace(/HH/g, hour.toString().padStart(2, '0'))
      .replace(/H/g, hour.toString().padStart(1, '0'))
      .replace(/mm/g, minute.toString().padStart(2, '0'))
      .replace(/m/g, minute.toString().padStart(1, '0'))
      .replace(/ss/g, second.toString().padStart(2, '0'))
      .replace(/s/g, second.toString().padStart(1, '0'))
      .replace(/SSS/g, millisecond.toString().padStart(3, '0'))
      .replace(/SS/g, millisecond.toString().padStart(2, '0'))
      .replace(/S/g, millisecond.toString().padStart(1, '0'))
  }

  /**
   * 根据指定的时间类型和数量减少内部日期。
   * @param type 时间类型，可以是毫秒、秒、分、时、日、月、年。
   * @param num 要减少的时间数量。
   * @returns 返回一个新的 LightDate 实例，其日期根据指定类型和数量减少。
   */
  public subscribe(type: ComputeType, num: number) {
    if (num <= 0) return new LightDate(this.dataDate)
    num = Math.trunc(num)

    if (type === 'millisecond') return new LightDate(this.dataDate.getTime() - num)
    if (type === 'second') return new LightDate(this.dataDate.getTime() - num * 1000)
    if (type === 'minute') return new LightDate(this.dataDate.getTime() - num * 1000 * 60)
    if (type === 'hour') return new LightDate(this.dataDate.getTime() - num * 1000 * 60 * 60)
    if (type === 'day') return new LightDate(this.dataDate.getTime() - num * 1000 * 60 * 60 * 24)

    if (type === 'month') {
      const numMonth = this.getMonth() - 1 - num
      return new LightDate(
        new Date(
          this.getFullYear() - Math.abs(Math.floor(numMonth / 12)),
          12 - Math.abs(numMonth),
          this.getDay(),
          this.getHours(),
          this.getMinutes(),
          this.getSeconds(),
          this.getMilliseconds()
        )
      )
    }

    if (type === 'year') {
      return new LightDate(
        new Date(this.getFullYear() - num, this.getMonth() - 1, this.getDay(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds())
      )
    }
    return new LightDate(this.dataDate)
  }

  /**
   * 根据指定的时间类型和数量增加内部日期。
   * @param type 时间类型，可以是毫秒、秒、分、时、日、月、年。
   * @param num 要增加的时间数量。
   * @returns 返回一个新的 LightDate 实例，其日期根据指定类型和数量增加。
   */
  public add(type: ComputeType, num: number) {
    if (num <= 0) return new LightDate(this.dataDate)
    num = Math.trunc(num)

    if (type === 'millisecond') return new LightDate(this.dataDate.getTime() + num)
    if (type === 'second') return new LightDate(this.dataDate.getTime() + num * 1000)
    if (type === 'minute') return new LightDate(this.dataDate.getTime() + num * 1000 * 60)
    if (type === 'hour') return new LightDate(this.dataDate.getTime() + num * 1000 * 60 * 60)
    if (type === 'day') return new LightDate(this.dataDate.getTime() + num * 1000 * 60 * 60 * 24)

    if (type === 'month') {
      const numMonth = this.getMonth() - 1 + num
      return new LightDate(
        new Date(
          this.getFullYear() + Math.floor(numMonth / 12),
          numMonth % 12,
          this.getDay(),
          this.getHours(),
          this.getMinutes(),
          this.getSeconds(),
          this.getMilliseconds()
        )
      )
    }

    if (type === 'year') {
      return new LightDate(
        new Date(this.getFullYear() + num, this.getMonth() - 1, this.getDay(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds())
      )
    }

    return new LightDate(this.dataDate)
  }

  /**
   * 根据指定的时间类型，获取格式化的日期字符串。
   * @param date 需要格式化的日期。
   * @param type 时间类型，决定返回的日期字符串的格式。
   * @returns 返回格式化的日期字符串。
   */
  private static getFormat(date: DateType, type: ComputeType) {
    let formatStr = ''

    if (type === 'year') formatStr = 'YYYY'
    else if (type === 'month') formatStr = 'YYYY-MM'
    else if (type === 'day') formatStr = 'YYYY-MM-DD'
    else if (type === 'hour') formatStr = 'YYYY-MM-DD HH'
    else if (type === 'minute') formatStr = 'YYYY-MM-DD HH:mm'
    else if (type === 'second') formatStr = 'YYYY-MM-DD HH:mm:ss'
    else formatStr = 'YYYY-MM-DD HH:mm:ss SSS'

    return new LightDate(date).format(formatStr)
  }

  /**
   * 比较两个日期是否相同。
   * @param date1 第一个日期。
   * @param date2 第二个日期。
   * @param type 时间类型，用于决定比较的精度。
   * @returns 如果两个日期相同返回 true，否则返回 false。
   */
  public static isSame(date1: DateType, date2: DateType, type: ComputeType = 'millisecond') {
    return LightDate.getFormat(date1, type) === LightDate.getFormat(date2, type)
  }

  /**
   * 比较第一个日期是否在第二个日期之后。
   * @param date1 第一个日期。
   * @param date2 第二个日期。
   * @param type 时间类型，用于决定比较的精度。
   * @returns 如果第一个日期在第二个日期之后返回 true，否则返回 false。
   */
  public static beforeBig(date1: DateType, date2: DateType, type: ComputeType = 'millisecond') {
    return new Date(LightDate.getFormat(date1, type)).getTime() > new Date(LightDate.getFormat(date2, type)).getTime()
  }

  /**
   * 比较第一个日期是否在第二个日期之前。
   * @param date1 第一个日期。
   * @param date2 第二个日期。
   * @param type 时间类型，用于决定比较的精度。
   * @returns 如果第一个日期在第二个日期之前返回 true，否则返回 false。
   */
  public static afterBig(date1: DateType, date2: DateType, type: ComputeType = 'millisecond') {
    return new Date(LightDate.getFormat(date1, type)).getTime() < new Date(LightDate.getFormat(date2, type)).getTime()
  }
}

/**
 * 创建并返回一个 LightDate 实例。
 * @param dataDate 可选参数，用于指定初始日期。
 * @returns 返回一个新的 LightDate 实例。
 */
export default function lightDate(dataDate?: DateType) {
  return new LightDate(dataDate)
}
