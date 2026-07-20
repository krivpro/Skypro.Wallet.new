import type { ApiTransaction } from '../../../shared/api/types'
import {
  CATEGORY_API_BY_LABEL,
  CATEGORY_LABEL_BY_API,
  CHART_CLASS_BY_API,
} from '../../expenses/model/categoryMap'
import { formatRubles } from '../../expenses/model/transactionMappers'
import type { AnalysisPlanBar } from './types'
import { EXPENSE_CATEGORY_OPTIONS } from '../../expenses/model/categories'

const CHART_MAX_HEIGHT_PX = 180

export function buildChartBarsFromTransactions(
  transactions: ApiTransaction[],
): AnalysisPlanBar[] {
  const sums = new Map<string, number>()
  for (const t of transactions) {
    const label = CATEGORY_LABEL_BY_API[t.category]
    sums.set(label, (sums.get(label) ?? 0) + t.sum)
  }

  const maxSum = Math.max(...Array.from(sums.values()), 0)

  return EXPENSE_CATEGORY_OPTIONS.map(({ label }) => {
    const sum = sums.get(label) ?? 0
    const apiKey = CATEGORY_API_BY_LABEL[label]
    const chartClass = apiKey ? CHART_CLASS_BY_API[apiKey] : 'chart_other'
    const heightPercent = maxSum > 0 ? (sum / maxSum) * 100 : 0
    const heightPx = maxSum > 0 ? Math.max(4, (sum / maxSum) * CHART_MAX_HEIGHT_PX) : 4

    return {
      amount: formatRubles(sum),
      chartClass,
      category: label,
      heightPx,
      heightPercent,
    }
  })
}

export function sumTransactions(transactions: ApiTransaction[]): number {
  return transactions.reduce((acc, t) => acc + t.sum, 0)
}
