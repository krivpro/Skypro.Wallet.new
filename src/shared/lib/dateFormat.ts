const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const

const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const

/** DD.MM.YYYY → M-D-YYYY для API */
export function uiDateToApiDate(value: string): string {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim())
  if (!m) throw new Error('Некорректная дата')
  const day = Number(m[1])
  const month = Number(m[2])
  const year = Number(m[3])
  return `${month}-${day}-${year}`
}

/** ISO или Date → DD.MM.YYYY */
export function formatDisplayDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export function formatPeriodDayLabel(year: number, month: number, day: number): string {
  return `${day} ${MONTH_NAMES_GENITIVE[month - 1]} ${year}`
}

export function buildMonthTitle(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`
}

export function parseMonthTitle(title: string): { year: number; month: number } | null {
  const parts = title.trim().split(/\s+/)
  if (parts.length !== 2) return null
  const monthIndex = MONTH_NAMES.findIndex((name) => name === parts[0])
  const year = Number(parts[1])
  if (monthIndex < 0 || !Number.isFinite(year)) return null
  return { year, month: monthIndex + 1 }
}

export function calendarDayToApiDate(year: number, month: number, day: number): string {
  return `${month}-${day}-${year}`
}

export type CalendarMonthData = {
  monthTitle: string
  monthDays: readonly number[]
  year: number
  month: number
}

export function buildRecentCalendarMonths(count = 6): CalendarMonthData[] {
  const now = new Date()
  const result: CalendarMonthData[] = []
  for (let offset = count - 1; offset >= 0; offset--) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const daysInMonth = new Date(year, month, 0).getDate()
    result.push({
      monthTitle: buildMonthTitle(year, month),
      monthDays: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      year,
      month,
    })
  }
  return result
}
