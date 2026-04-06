'use client'

import { useEffect, useRef } from 'react'
import { Box, Paper, Typography, Button, CircularProgress, Badge, Card } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTasks } from '@/hooks/useTasks'
import TaskCard from '../Task/TaskCard'
import useBoardStore from '@/store/useBoardStore'
import { COLUMN_CONFIG } from '@/constants/columns'
import type { Column } from '@/types'

export default function BoardColumn({ column }: { column: Column }) {
  const { label, color } = COLUMN_CONFIG[column]
  const { tasks, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useTasks(column)
  const openCreateDialog = useBoardStore((s) => s.openCreateDialog)
  const activeTask = useBoardStore((s) => s.activeTask)
  const overId = useBoardStore((s) => s.overId)

  const { setNodeRef, isOver } = useDroppable({ id: column, data: { column } })
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage() },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const isTargetColumn = !!activeTask && activeTask.column === column && !tasks.find((t) => t.id === activeTask.id)
  const overIndex = isTargetColumn ? tasks.findIndex((t) => t.id === overId) : -1
  const placeholderIndex = overIndex >= 0 ? overIndex : isTargetColumn ? tasks.length : -1

  const dropPlaceholder = (
    <Card
      elevation={0}
      sx={{ mb: 1, height: 80, border: '2px dashed', borderColor: 'primary.light', bgcolor: 'primary.50', borderRadius: 1 }}
    />
  )

  return (
    <Paper
      elevation={0}
      sx={{
        flex: '1 1 0',
        width: { xs: '100%', md: 'auto' },
        minWidth: { md: 240 },
        maxWidth: { md: 320 },
        bgcolor: isOver ? '#e8f0fe' : '#ebecf0',
        borderRadius: 2,
        transition: 'background-color 0.15s',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: { xs: 'none', md: 'calc(100vh - 100px)' },
      }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary', flex: 1 }}
        >
          {label}
        </Typography>
        <Badge
          badgeContent={tasks.length}
          color="default"
          sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 18, height: 18, bgcolor: '#dfe1e6', color: '#42526e' } }}
        >
          <span />
        </Badge>
        {isFetching && !isFetchingNextPage && <CircularProgress size={12} sx={{ color: 'text.disabled' }} />}
      </Box>

      <Box ref={setNodeRef} sx={{ px: 1.5, pb: 1, overflowY: { xs: 'visible', md: 'auto' }, flex: 1 }}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task, index) => (
            <Box key={task.id}>
              {placeholderIndex === index && dropPlaceholder}
              <TaskCard task={task} />
            </Box>
          ))}
          {placeholderIndex === tasks.length && dropPlaceholder}
        </SortableContext>

        <div ref={sentinelRef} style={{ height: 1 }} />

        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <CircularProgress size={18} />
          </Box>
        )}
      </Box>

      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <Button
          startIcon={<AddIcon />}
          size="small"
          fullWidth
          onClick={() => openCreateDialog(column)}

          sx={{ justifyContent: 'flex-start', color: 'text.secondary', textTransform: 'none', fontSize: 13 }}
        >
          Add task
        </Button>
      </Box>
    </Paper>
  )
}
