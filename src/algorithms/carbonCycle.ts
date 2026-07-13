import type { CarbonDayType } from '@/src/types'

export const carbonLabels: Record<CarbonDayType, string> = { high:'高碳日', medium:'中碳日', low:'低碳日' }
export const carbonDescriptions: Record<CarbonDayType, string> = {
  high:'主食充足 · 少油烹饪', medium:'主食适量 · 均衡搭配', low:'减少主食 · 增加蔬菜与蛋白质',
}

export function carbonTypeForDate(date: Date): CarbonDayType {
  const day = date.getDay()
  if (day === 2 || day === 5) return 'high'
  if (day === 3 || day === 6) return 'low'
  return 'medium'
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2,'0')
  const day = String(date.getDate()).padStart(2,'0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(key: string): Date {
  const [year,month,day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export function formatChineseDate(date: Date): string {
  return `${date.getMonth()+1}月${date.getDate()}日`
}

export function weekdayLabel(date: Date): string {
  return ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]
}
