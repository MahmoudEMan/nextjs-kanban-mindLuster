import type { Task, Column } from '@/types'

const STORAGE_KEY = 'kanban_tasks'

const SEED_DATA: Task[] = [
  { id: 1, title: 'Set up project structure', description: 'Initialize Next.js app with TypeScript and configure linting.', column: 'done' },
  { id: 2, title: 'Design database schema', description: 'Define entity relationships and constraints for the new feature.', column: 'done' },
  { id: 3, title: 'Build authentication flow', description: 'Implement login, register, and token refresh endpoints.', column: 'in_progress' },
  { id: 4, title: 'Create dashboard UI', description: 'Design and build the main dashboard layout with MUI components.', column: 'in_progress' },
  { id: 5, title: 'Write unit tests', description: 'Cover all service-layer functions with Jest tests.', column: 'review' },
  { id: 6, title: 'Add dark mode support', description: 'Extend the MUI theme to support system-preferred colour scheme.', column: 'review' },
  { id: 7, title: 'Integrate analytics', description: 'Hook up page-view and event tracking via the analytics SDK.', column: 'backlog' },
  { id: 8, title: 'Improve error handling', description: 'Add user-friendly error boundaries and toast notifications.', column: 'backlog' },
  { id: 9, title: 'Performance audit', description: 'Profile bundle size and lazy-load heavy components.', column: 'backlog' },
  { id: 10, title: 'Write API documentation', description: 'Document all public endpoints with request/response examples.', column: 'backlog' },
]

function readAll(): Task[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null as unknown as Task[]
    return JSON.parse(raw) as Task[]
  } catch {
    return []
  }
}

function writeAll(tasks: Task[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function getTasks(): Task[] {
  const tasks = readAll()
  if (tasks === null) {
    writeAll(SEED_DATA)
    return SEED_DATA
  }
  return tasks
}

function nextId(tasks: Task[]): number {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1
}

export const storage = {
  getAll(): Task[] {
    return getTasks()
  },

  getByColumn(column: Column): Task[] {
    return getTasks().filter((t) => t.column === column)
  },

  create(data: Omit<Task, 'id'>): Task {
    const tasks = getTasks()
    const task: Task = { ...data, id: nextId(tasks) }
    writeAll([...tasks, task])
    return task
  },

  update(id: number, patch: Partial<Omit<Task, 'id'>>): Task {
    const tasks = getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error(`Task ${id} not found`)
    const updated = { ...tasks[index], ...patch }
    const next = [...tasks]
    next[index] = updated
    writeAll(next)
    return updated
  },

  delete(id: number): void {
    writeAll(getTasks().filter((t) => t.id !== id))
  },
}
