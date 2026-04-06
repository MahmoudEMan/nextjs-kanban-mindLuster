export type Column = 'backlog' | 'in_progress' | 'review' | 'done'

export interface Task {
  id: number
  title: string
  description: string
  column: Column
}

export interface FetchTasksParams {
  column: Column
  page?: number
  search?: string
  limit?: number
}

export interface TasksPage {
  data: Task[]
  total: number
}

export interface DialogState {
  open: boolean
  mode: 'create' | 'edit'
  task: Partial<Task> | null
}
