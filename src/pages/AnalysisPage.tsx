import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  buildChartBarsFromTransactions,
  sumTransactions,
} from '../features/analysis/model/buildChartBars'
import type { AnalysisPlanBar } from '../features/analysis/model/types'
import {
  PeriodCalendar,
  type CalendarDaySelection,
  type PeriodCalendarMonth,
} from '../features/analysis/ui/PeriodCalendar'
import { SpendingCategoryBars } from '../features/analysis/ui/SpendingCategoryBars'
import { formatRubles } from '../features/expenses/model/transactionMappers'
import type { ApiTransaction } from '../shared/api/types'
import { fetchTransactionsByPeriod } from '../shared/api/transactionsApi'
import { redirectIfUnauthorized } from '../shared/api/unauthorized'
import {
  buildRecentCalendarMonths,
  calendarDayToApiDate,
  formatPeriodDayLabel,
  parseMonthTitle,
} from '../shared/lib/dateFormat'

const CALENDAR_MONTHS_COUNT = 6
const DEFAULT_SELECTED_DAY = 10

function toPeriodCalendarMonths(
  months: ReturnType<typeof buildRecentCalendarMonths>,
): PeriodCalendarMonth[] {
  return months.map(({ monthTitle, monthDays }) => ({ monthTitle, monthDays }))
}

function buildDefaultDaySelection(
  months: ReturnType<typeof buildRecentCalendarMonths>,
): CalendarDaySelection | null {
  const lastMonth = months[months.length - 1]
  if (!lastMonth) return null

  return {
    monthTitle: lastMonth.monthTitle,
    day: Math.min(DEFAULT_SELECTED_DAY, lastMonth.monthDays.length),
  }
}

export function AnalysisPage() {
  const navigate = useNavigate()
  const calendarSource = useMemo(
    () => buildRecentCalendarMonths(CALENDAR_MONTHS_COUNT),
    [],
  )
  const calendarMonths = useMemo(() => toPeriodCalendarMonths(calendarSource), [calendarSource])
  const defaultSelection = useMemo(
    () => buildDefaultDaySelection(calendarSource),
    [calendarSource],
  )

  const [selectedDay, setSelectedDay] = useState<CalendarDaySelection | null>(defaultSelection)
  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [loading, setLoading] = useState(false)

  const loadDayTransactions = useCallback(
    async (selection: CalendarDaySelection) => {
      const parsedMonth = parseMonthTitle(selection.monthTitle)
      if (!parsedMonth) return

      const apiDate = calendarDayToApiDate(parsedMonth.year, parsedMonth.month, selection.day)
      setLoading(true)
      try {
        const data = await fetchTransactionsByPeriod({ start: apiDate, end: apiDate })
        setTransactions(data)
      } catch (error) {
        if (!redirectIfUnauthorized(error, navigate)) {
          setTransactions([])
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    if (!selectedDay) return
    const timeoutId = window.setTimeout(() => {
      void loadDayTransactions(selectedDay)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [selectedDay, loadDayTransactions])

  const chartBars: AnalysisPlanBar[] = useMemo(
    () => buildChartBarsFromTransactions(transactions),
    [transactions],
  )

  const totalAmount = sumTransactions(transactions)
  const periodDateLabel = useMemo(() => {
    if (!selectedDay) return '—'
    const parsedMonth = parseMonthTitle(selectedDay.monthTitle)
    if (!parsedMonth) return '—'
    return formatPeriodDayLabel(parsedMonth.year, parsedMonth.month, selectedDay.day)
  }, [selectedDay])

  return (
    <div className="content">
      <div className="content__nav-panel">
        <h1 className="title main__title">Анализ расходов</h1>
      </div>
      <PeriodCalendar
        months={calendarMonths}
        initialSelection={defaultSelection}
        onSelectedDayChange={setSelectedDay}
      />
      {loading ? (
        <div className="window window_big">
          <p className="window__text">Загрузка…</p>
        </div>
      ) : (
        <SpendingCategoryBars
          totalTitle={formatRubles(totalAmount)}
          periodDescription="Расходы за"
          periodDateLabel={periodDateLabel}
          bars={chartBars}
        />
      )}
    </div>
  )
}
