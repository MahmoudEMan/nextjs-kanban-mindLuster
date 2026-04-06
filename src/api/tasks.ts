import { storage } from '@/lib/storage'
import type { FetchTasksParams, Task, TasksPage } from '@/types'

export async function fetchTasks({
  column,
  page = 1,
  search = '',
  limit = 8,
}: FetchTasksParams): Promise<TasksPage> {
  let tasks = storage.getByColumn(column)

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    )
  }

  const total = tasks.length
  const start = (page - 1) * limit
  const data = tasks.slice(start, start + limit)

  return { data, total }
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  return storage.create(task)
}

export async function updateTask(
  id: number,
  patch: Partial<Omit<Task, 'id'>>,
): Promise<Task> {
  return storage.update(id, patch)
}

export async function deleteTask(id: number): Promise<void> {
  storage.delete(id)
}
