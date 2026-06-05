import type { AnalysisPlanBar } from '../model/types'

type SpendingCategoryBarsProps = {
  /** Заголовок окна: итоговая сумма, как в макете «9 581 ₽» */
  totalTitle: string
  periodDescription: string
  periodDateLabel: string
  bars: AnalysisPlanBar[]
}

/**
 * Нижнее большое окно анализа: сумма, подпись периода и полоски по категориям (классы plan / chart_* из макета).
 */
export function SpendingCategoryBars({
  totalTitle,
  periodDescription,
  periodDateLabel,
  bars,
}: SpendingCategoryBarsProps) {
  return (
    <div className="window window_big">
      <h2 className="title window__title">{totalTitle}</h2>
      <div className="period">
        <p className="period__text">{periodDescription}</p>
        <p className="period__date">{periodDateLabel}</p>
      </div>
      <div className="plan">
        {bars.map((item) => (
          <div className="plan__indicator" key={item.category}>
            <h3 className="amount">{item.amount}</h3>
            <div
              className={`chart ${item.chartClass}`}
              style={{ height: `${item.heightPx}px` }}
              title={`${item.heightPercent.toFixed(0)}%`}
            />
            <p className="category">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
