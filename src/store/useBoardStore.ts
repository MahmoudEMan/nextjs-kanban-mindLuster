import { create } from 'zustand'
import type { Column, DialogState, Task } from '@/types'

interface BoardStore {
  searchQuery: string
  activeTask: Task | null
  overId: string | number | null
  dialog: DialogState
  deleteConfirm: { open: boolean; taskId: number | null }

  setSearch: (q: string) => void
  setActiveTask: (task: Task | null) => void
  setOverId: (id: string | number | null) => void
  openCreateDialog: (column: Column) => void
  openEditDialog: (task: Task) => void
  closeDialog: () => void
  openDeleteConfirm: (taskId: number) => void
  closeDeleteConfirm: () => void
}

const useBoardStore = create<BoardStore>((set) => ({
  searchQuery: '',
  activeTask: null,
  overId: null,
  dialog: { open: false, mode: 'create', task: null },
  deleteConfirm: { open: false, taskId: null },

  setSearch: (q) => set({ searchQuery: q }),
  setActiveTask: (task) => set({ activeTask: task }),
  setOverId: (id) => set({ overId: id }),

  openCreateDialog: (column) =>
    set({ dialog: { open: true, mode: 'create', task: { column } } }),
  openEditDialog: (task) =>
    set({ dialog: { open: true, mode: 'edit', task } }),
  closeDialog: () =>
    set({ dialog: { open: false, mode: 'create', task: null } }),
  openDeleteConfirm: (taskId) =>
    set({ deleteConfirm: { open: true, taskId } }),
  closeDeleteConfirm: () =>
    set({ deleteConfirm: { open: false, taskId: null } }),
}))

export default useBoardStore
