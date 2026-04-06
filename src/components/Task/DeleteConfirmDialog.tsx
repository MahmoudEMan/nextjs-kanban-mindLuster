'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import useBoardStore from '@/store/useBoardStore'
import { useDeleteTask } from '@/hooks/useTaskMutations'

export default function DeleteConfirmDialog() {
  const { open, taskId } = useBoardStore((s) => s.deleteConfirm)
  const closeDeleteConfirm = useBoardStore((s) => s.closeDeleteConfirm)
  const { mutate: deleteTask, isPending } = useDeleteTask()

  const handleConfirm = () => {
    if (taskId == null) return
    deleteTask(taskId, { onSettled: closeDeleteConfirm })
  }

  return (
    <Dialog open={open} onClose={closeDeleteConfirm} maxWidth="xs" fullWidth>
      <DialogTitle>Delete task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this task? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeDeleteConfirm} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
