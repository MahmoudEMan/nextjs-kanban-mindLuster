'use client'

import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import useBoardStore from '@/store/useBoardStore'
import { COLUMN_CONFIG } from '@/constants/columns'
import type { Task } from '@/types'

interface Props {
  task: Task
  overlay?: boolean
}

export default function TaskCard({ task, overlay = false }: Props) {
  const openEditDialog = useBoardStore((s) => s.openEditDialog)
  const openDeleteConfirm = useBoardStore((s) => s.openDeleteConfirm)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { task, column: task.column },
      disabled: overlay,
    })

  const { color } = COLUMN_CONFIG[task.column]

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 }}
      {...attributes}
      {...listeners}
      elevation={overlay ? 4 : 1}
      sx={{ mb: 1, cursor: overlay ? 'grabbing' : 'grab', '&:hover': { boxShadow: 3 }, userSelect: 'none' }}
    >
      <CardContent sx={{ p: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="body2" fontWeight={600} sx={{ flex: 1, lineHeight: 1.4 }}>
            {task.title}
          </Typography>
          {!overlay && (
            <Box sx={{ display: 'flex', flexShrink: 0 }}>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); openEditDialog(task) }}
                onPointerDown={(e) => e.stopPropagation()}
                sx={{ p: 0.5 }}
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); openDeleteConfirm(task.id) }}
                onPointerDown={(e) => e.stopPropagation()}
                sx={{ p: 0.5, color: 'error.light' }}
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}
        </Box>
        {task.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {task.description}
          </Typography>
        )}
        <Chip
          label={task.column.replace('_', ' ')}
          size="small"
          sx={{
            mt: 1,
            height: 18,
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            bgcolor: color + '20',
            color,
          }}
        />
      </CardContent>
    </Card>
  )
}
