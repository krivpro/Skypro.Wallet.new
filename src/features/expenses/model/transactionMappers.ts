import { formatDisplayDate } from '../../../shared/lib/dateFormat'
import type { ApiTransaction } from '../../../shared/api/types'
import { CATEGORY_LABEL_BY_API } from './categoryMap'
import type { ExpenseTableRow } from './types'

export function formatRubles(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₽`
}

export function mapTransactionToRow(transaction: ApiTransaction): ExpenseTableRow {
  return {
    id: transaction._id,
    description: transaction.description,
    category: CATEGORY_LABEL_BY_API[transaction.category],
    date: formatDisplayDate(transaction.date),
    amount: formatRubles(transaction.sum),
  }
}

export function mapTransactionsToRows(transactions: ApiTransaction[]): ExpenseTableRow[] {
  return transactions.map(mapTransactionToRow)
}
