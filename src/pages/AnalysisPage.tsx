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
  type CalendarPeriodSelection,
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
  formatPeriodRangeLabel,
  parseMonthTitle,
} from '../shared/lib/dateFormat'

const CALENDAR_MONTHS_COUNT = 6

function toPeriodCalendarMonths(
  months: ReturnType<typeof buildRecentCalendarMonths>,
): PeriodCalendarMonth[] {
  return months.map(({ monthTitle, monthDays }) => ({ monthTitle, monthDays }))
}

function buildDefaultPeriod(
  months: ReturnType<typeof buildRecentCalendarMonths>,
): CalendarPeriodSelection | null {
  const currentMonth = months[months.length - 1]
  if (!currentMonth) return null

  const today = new Date()
  const day: CalendarDaySelection = {
    monthTitle: currentMonth.monthTitle,
    day: Math.min(today.getDate(), currentMonth.monthDays.length),
  }
  return { start: day, end: day }
}

function selectionToApiDate(selection: CalendarDaySelection): string | null {
  const parsed = parseMonthTitle(selection.monthTitle)
  if (!parsed) return null
  return calendarDayToApiDate(parsed.year, parsed.month, selection.day)
}

export function AnalysisPage() {
  const navigate = useNavigate()
  const calendarSource = useMemo(
    () => buildRecentCalendarMonths(CALENDAR_MONTHS_COUNT),
    [],
  )
  const calendarMonths = useMemo(() => toPeriodCalendarMonths(calendarSource), [calendarSource])
  const defaultPeriod = useMemo(() => buildDefaultPeriod(calendarSource), [calendarSource])

  const [selectedPeriod, setSelectedPeriod] = useState<CalendarPeriodSelection | null>(
    defaultPeriod,
  )
  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [loading, setLoading] = useState(false)

  const loadPeriodTransactions = useCallback(
    async (period: CalendarPeriodSelection) => {
      const start = selectionToApiDate(period.start)
      const end = selectionToApiDate(period.end)
      if (!start || !end) return

      setLoading(true)
      try {
        const data = await fetchTransactionsByPeriod({ start, end })
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
    if (!selectedPeriod) return
    const timeoutId = window.setTimeout(() => {
      void loadPeriodTransactions(selectedPeriod)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [selectedPeriod, loadPeriodTransactions])

  const chartBars: AnalysisPlanBar[] = useMemo(
    () => buildChartBarsFromTransactions(transactions),
    [transactions],
  )

  const totalAmount = sumTransactions(transactions)
  const periodDateLabel = useMemo(() => {
    if (!selectedPeriod) return '—'
    const start = parseMonthTitle(selectedPeriod.start.monthTitle)
    const end = parseMonthTitle(selectedPeriod.end.monthTitle)
    if (!start || !end) return '—'
    return formatPeriodRangeLabel(
      { year: start.year, month: start.month, day: selectedPeriod.start.day },
      { year: end.year, month: end.month, day: selectedPeriod.end.day },
    )
  }, [selectedPeriod])

  return (
    <div className="content">
      <div className="content__nav-panel">
        <h1 className="title main__title">Анализ расходов</h1>
      </div>
      <PeriodCalendar
        months={calendarMonths}
        initialPeriod={defaultPeriod}
        onPeriodChange={setSelectedPeriod}
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
