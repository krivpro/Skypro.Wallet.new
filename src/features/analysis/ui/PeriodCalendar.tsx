import { useState } from 'react'
import { DEFAULT_WEEK_DAY_LABELS } from '../model/constants'

export type CalendarDaySelection = { monthTitle: string; day: number }

export type PeriodCalendarMonth = {
  monthTitle: string
  monthDays: readonly number[]
}

type PeriodCalendarProps = {
  months: readonly PeriodCalendarMonth[]
  weekDayLabels?: readonly string[]
  initialSelection?: CalendarDaySelection | null
  onSelectedDayChange?: (selection: CalendarDaySelection) => void
}

export function PeriodCalendar({
  months,
  weekDayLabels = DEFAULT_WEEK_DAY_LABELS,
  initialSelection,
  onSelectedDayChange,
}: PeriodCalendarProps) {
  const defaultSelection: CalendarDaySelection | null =
    months[0] != null
      ? { monthTitle: months[0].monthTitle, day: 10 }
      : null

  const [selected, setSelected] = useState<CalendarDaySelection | null>(
    initialSelection ?? defaultSelection,
  )

  const selectDay = (monthTitle: string, day: number) => {
    const next: CalendarDaySelection = { monthTitle, day }
    setSelected(next)
    onSelectedDayChange?.(next)
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
                {monthDays.map((d) => (
                  <button
                    key={`${monthTitle}-${d}`}
                    type="button"
                    className={`month__day calendar__item${
                      selected?.monthTitle === monthTitle && selected.day === d
                        ? ' month__day_selected'
                        : ''
                    }`}
                    onClick={() => selectDay(monthTitle, d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
