import { useState } from 'react'
import { calendarDaySortValue, parseMonthTitle } from '../../../shared/lib/dateFormat'
import { DEFAULT_WEEK_DAY_LABELS } from '../model/constants'

export type CalendarDaySelection = { monthTitle: string; day: number }

export type CalendarPeriodSelection = {
  start: CalendarDaySelection
  end: CalendarDaySelection
}

export type PeriodCalendarMonth = {
  monthTitle: string
  monthDays: readonly number[]
}

type PeriodCalendarProps = {
  months: readonly PeriodCalendarMonth[]
  weekDayLabels?: readonly string[]
  initialPeriod?: CalendarPeriodSelection | null
  onPeriodChange?: (period: CalendarPeriodSelection) => void
}

function daySortValue(selection: CalendarDaySelection): number | null {
  const parsed = parseMonthTitle(selection.monthTitle)
  if (!parsed) return null
  return calendarDaySortValue(parsed.year, parsed.month, selection.day)
}

function compareDays(a: CalendarDaySelection, b: CalendarDaySelection): number {
  const av = daySortValue(a)
  const bv = daySortValue(b)
  if (av == null || bv == null) return 0
  return av - bv
}

function normalizePeriod(
  a: CalendarDaySelection,
  b: CalendarDaySelection,
): CalendarPeriodSelection {
  return compareDays(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a }
}

function isSameDay(a: CalendarDaySelection, b: CalendarDaySelection): boolean {
  return a.monthTitle === b.monthTitle && a.day === b.day
}

function isDayInPeriod(day: CalendarDaySelection, period: CalendarPeriodSelection): boolean {
  return compareDays(day, period.start) >= 0 && compareDays(day, period.end) <= 0
}

function dayClassName(
  day: CalendarDaySelection,
  period: CalendarPeriodSelection | null,
): string {
  if (!period || !isDayInPeriod(day, period)) {
    return 'month__day calendar__item'
  }

  const isEndpoint = isSameDay(day, period.start) || isSameDay(day, period.end)
  return `month__day calendar__item${
    isEndpoint ? ' month__day_selected' : ' month__day_in-range'
  }`
}

export function PeriodCalendar({
  months,
  weekDayLabels = DEFAULT_WEEK_DAY_LABELS,
  initialPeriod,
  onPeriodChange,
}: PeriodCalendarProps) {
  const fallbackPeriod: CalendarPeriodSelection | null =
    months[0] != null
      ? {
          start: { monthTitle: months[0].monthTitle, day: 1 },
          end: { monthTitle: months[0].monthTitle, day: 1 },
        }
      : null

  const [period, setPeriod] = useState<CalendarPeriodSelection | null>(
    initialPeriod ?? fallbackPeriod,
  )
  /** После клика по началу диапазона ждём клик по концу */
  const [pickingEnd, setPickingEnd] = useState(false)

  const selectDay = (monthTitle: string, day: number) => {
    const clicked: CalendarDaySelection = { monthTitle, day }

    if (!period || !pickingEnd) {
      const next = { start: clicked, end: clicked }
      setPeriod(next)
      setPickingEnd(true)
      onPeriodChange?.(next)
      return
    }

    const next = normalizePeriod(period.start, clicked)
    setPeriod(next)
    setPickingEnd(false)
    onPeriodChange?.(next)
  }

  return (
    <div className="window window_small calendar">
      <h2 className="title window__title">Период</h2>
      <div className="calendar__week-fixed">
        <div className="week calendar__grid">
          {weekDayLabels.map((d) => (
            <p key={d} className="week__day calendar__item">
              {d}
            </p>
          ))}
        </div>
        <div className="line calendar__line-under-week" aria-hidden="true" />
      </div>
      <div className="calendar__scroll-body">
        <div className="calendar__scroll-inner">
          {months.map(({ monthTitle, monthDays }) => (
            <div key={monthTitle} className="month">
              <h3 className="month__name">{monthTitle}</h3>
              <div className="month__days calendar__grid">
                {monthDays.map((d) => {
                  const day = { monthTitle, day: d }
                  return (
                    <button
                      key={`${monthTitle}-${d}`}
                      type="button"
                      className={dayClassName(day, period)}
                      onClick={() => selectDay(monthTitle, d)}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
