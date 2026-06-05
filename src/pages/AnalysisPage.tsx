import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  buildChartBarsFromTransactions,
  sumTransactions,
} from '../features/analysis/model/buildChartBars'
import type { AnalysisPlanBar } from '../features/analysis/model/types'
import { PeriodCalendar } from '../features/analysis/ui/PeriodCalendar'
import type { PeriodCalendarMonth } from '../features/analysis/ui/PeriodCalendar'
import { SpendingCategoryBars } from '../features/analysis/ui/SpendingCategoryBars'
import { formatRubles } from '../features/expenses/model/transactionMappers'
import { ApiError } from '../shared/api/client'
import type { ApiTransaction } from '../shared/api/types'
import { fetchTransactionsByPeriod } from '../shared/api/transactionsApi'
import {
  buildRecentCalendarMonths,
  calendarDayToApiDate,
  formatPeriodDayLabel,
  parseMonthTitle,
  type CalendarMonthData,
} from '../shared/lib/dateFormat'

type DaySelection = { monthTitle: string; day: number }

function toCalendarMonths(data: CalendarMonthData[]): PeriodCalendarMonth[] {
  return data.map(({ monthTitle, monthDays }) => ({ monthTitle, monthDays }))
}

export function AnalysisPage() {
  const navigate = useNavigate()
  const calendarSource = useMemo(() => buildRecentCalendarMonths(6), [])
  const calendarMonths = useMemo(() => toCalendarMonths(calendarSource), [calendarSource])

  const defaultMonth = calendarSource[calendarSource.length - 1]
  const defaultDay = Math.min(10, defaultMonth?.monthDays.length ?? 1)
  const defaultSelection: DaySelection | null = defaultMonth
    ? { monthTitle: defaultMonth.monthTitle, day: defaultDay }
    : null

  const [selected, setSelected] = useState<DaySelection | null>(defaultSelection)
  const [transactions, setTransactions] = useState<ApiTransaction[]>([])
  const [loading, setLoading] = useState(false)

  const loadDayTransactions = useCallback(
    async (selection: DaySelection) => {
      const parsed = parseMonthTitle(selection.monthTitle)
      if (!parsed) return

      const apiDate = calendarDayToApiDate(parsed.year, parsed.month, selection.day)
      setLoading(true)
      try {
        const data = await fetchTransactionsByPeriod({ start: apiDate, end: apiDate })
        setTransactions(data)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          navigate('/')
        } else {
          setTransactions([])
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate],
  )

  useEffect(() => {
    if (selected) void loadDayTransactions(selected)
  }, [selected, loadDayTransactions])

  const bars: AnalysisPlanBar[] = useMemo(
    () => buildChartBarsFromTransactions(transactions),
    [transactions],
  )

  const total = sumTransactions(transactions)
  const periodDateLabel = useMemo(() => {
    if (!selected) return '—'
    const parsed = parseMonthTitle(selected.monthTitle)
    if (!parsed) return '—'
    return formatPeriodDayLabel(parsed.year, parsed.month, selected.day)
  }, [selected])

  return (
    <div className="content">
      <div className="content__nav-panel">
        <h1 className="title main__title">Анализ расходов</h1>
      </div>
      <PeriodCalendar
        months={calendarMonths}
        initialSelection={defaultSelection}
        onSelectedDayChange={setSelected}
      />
      {loading ? (
        <div className="window window_big">
          <p className="window__text">Загрузка…</p>
        </div>
      ) : (
        <SpendingCategoryBars
          totalTitle={formatRubles(total)}
          periodDescription="Расходы за"
          periodDateLabel={periodDateLabel}
          bars={bars}
        />
      )}
    </div>
  )
}
