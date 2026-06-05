import type { AnalysisPlanBar } from './types'

export const DEFAULT_WEEK_DAY_LABELS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as const

/** 1…31 — как в макете для июля */
export const DEMO_MONTH_DAY_NUMBERS: readonly number[] = Array.from({ length: 31 }, (_, i) => i + 1)

export const DEMO_PLAN_BARS: AnalysisPlanBar[] = [
  { amount: '3 590 ₽', chartClass: 'chart_food', category: 'Еда', heightPx: 120, heightPercent: 100 },
  { amount: '1 835 ₽', chartClass: 'chart_transportation', category: 'Транспорт', heightPx: 61, heightPercent: 51 },
  { amount: '0 ₽', chartClass: 'chart_housing', category: 'Жилье', heightPx: 4, heightPercent: 0 },
  { amount: '1 250 ₽', chartClass: 'chart_entertainment', category: 'Развлечения', heightPx: 42, heightPercent: 35 },
  { amount: '600 ₽', chartClass: 'chart_education', category: 'Образование', heightPx: 20, heightPercent: 17 },
  { amount: '2 306 ₽', chartClass: 'chart_other', category: 'Другое', heightPx: 77, heightPercent: 64 },
]
