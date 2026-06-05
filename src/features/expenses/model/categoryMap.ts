import type { ApiCategory } from '../../../shared/api/types'
import type { ExpenseCategoryOption } from './types'

export const CATEGORY_API_BY_LABEL: Record<string, ApiCategory> = {
  Еда: 'food',
  Транспорт: 'transport',
  Жилье: 'housing',
  Развлечения: 'joy',
  Образование: 'education',
  Другое: 'others',
}

export const CATEGORY_LABEL_BY_API: Record<ApiCategory, string> = {
  food: 'Еда',
  transport: 'Транспорт',
  housing: 'Жилье',
  joy: 'Развлечения',
  education: 'Образование',
  others: 'Другое',
}

export const CHART_CLASS_BY_API: Record<ApiCategory, string> = {
  food: 'chart_food',
  transport: 'chart_transportation',
  housing: 'chart_housing',
  joy: 'chart_entertainment',
  education: 'chart_education',
  others: 'chart_other',
}

export function getCategoryApiKey(option: ExpenseCategoryOption): ApiCategory {
  return CATEGORY_API_BY_LABEL[option.label]
}
