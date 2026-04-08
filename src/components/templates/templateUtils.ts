import type { ResumeData } from '@/types/resume'

export type TemplateLayoutMode = 'compact' | 'medium' | 'full'

export interface TemplateProps {
  data: ResumeData
  layoutMode: TemplateLayoutMode
}

export function formatDate(date?: string): string {
  if (!date) return ''
  const [year, month] = date.split('-')
  if (!year || !month) return year || ''
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const monthIndex = parseInt(month, 10) - 1
  return `${monthNames[monthIndex] || ''} ${year}`
}
