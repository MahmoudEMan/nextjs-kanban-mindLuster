import type { Column } from '@/types'

export const COLUMN_CONFIG: Record<Column, { label: string; color: string }> = {
  backlog:     { label: 'Backlog',     color: '#6b778c' },
  in_progress: { label: 'In Progress', color: '#0052cc' },
  review:      { label: 'Review',      color: '#ff991f' },
  done:        { label: 'Done',        color: '#36b37e' },
}

export const COLUMNS = Object.keys(COLUMN_CONFIG) as Column[]
