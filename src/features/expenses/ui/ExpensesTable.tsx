import { DeleteExpenseIcon } from '../../../shared/icons/DeleteExpenseIcon'
import type { ExpenseTableRow } from '../model/types'

type ExpensesTableProps = {
  rows: ExpenseTableRow[]
  deletingId?: string | null
  onDeleteRow: (id: string) => void
}

export function ExpensesTable({ rows, deletingId, onDeleteRow }: ExpensesTableProps) {
  return (
    <div className="window__table table">
      <div className="table__row table__row_header">
        <div className="table__cell table__cell_header">Описание</div>
        <div className="table__cell table__cell_header">Категория</div>
        <div className="table__cell table__cell_header">Дата</div>
        <div className="table__cell table__cell_header">Сумма</div>
        <div className="table__cell table__cell_header"></div>
      </div>
      <div className="table__line line"></div>
      {rows.map((row) => (
        <div className="table__row" key={row.id}>
          <div className="table__cellr">{row.description}</div>
          <div className="table__cellr">{row.category}</div>
          <div className="table__cellr">{row.date}</div>
          <div className="table__cellr">{row.amount}</div>
          <button
            type="button"
            className="table__cellr"
            aria-label="Удалить расход"
            disabled={deletingId === row.id}
            onClick={() => onDeleteRow(row.id)}
          >
            <DeleteExpenseIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
