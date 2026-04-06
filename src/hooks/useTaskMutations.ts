import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, updateTask, deleteTask } from '@/api/tasks'
import useBoardStore from '@/store/useBoardStore'
import type { Task } from '@/types'

export function useCreateTask() {
  const queryClient = useQueryClient()
  const closeDialog = useBoardStore((s) => s.closeDialog)

  return useMutation({
    mutationFn: (task: Omit<Task, 'id'>) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      closeDialog()
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const closeDialog = useBoardStore((s) => s.closeDialog)

  return useMutation({
    mutationFn: ({ id, ...patch }: Pick<Task, 'id'> & Partial<Omit<Task, 'id'>>) =>
      updateTask(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      closeDialog()
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, column }: Pick<Task, 'id' | 'column'>) =>
      updateTask(id, { column }),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
