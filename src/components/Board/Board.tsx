"use client";

import { useRef } from "react";
import { Box } from "@mui/material";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import useBoardStore from "@/store/useBoardStore";
import { useMoveTask } from "@/hooks/useTaskMutations";
import BoardColumn from "./BoardColumn";
import TaskCard from "../Task/TaskCard";
import TaskDialog from "../Task/TaskDialog";
import DeleteConfirmDialog from "../Task/DeleteConfirmDialog";
import { COLUMNS } from "@/constants/columns";
import type { Column, Task, TasksPage } from "@/types";

interface DragState {
  task: Task;
  targetColumn: Column;
  overId: number | string | null;
}

export default function Board() {
  const rqClient = useQueryClient();
  const activeTask = useBoardStore((s) => s.activeTask);
  const { mutate: moveTask } = useMoveTask();

  // Ref holds current drag state — always fresh, no stale closures
  const drag = useRef<DragState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = active.data.current?.task as Task;
    if (!task) return;
    drag.current = { task, targetColumn: task.column, overId: null };
    useBoardStore.getState().setActiveTask(task);
    useBoardStore.getState().setOverId(null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || !drag.current) return;
    const task = active.data.current?.task as Task;
    if (!task) return;
    const targetColumn = (over.data.current?.column ?? over.id) as Column;
    drag.current.targetColumn = targetColumn;
    drag.current.overId = over.id;
    useBoardStore.getState().setActiveTask({ ...task, column: targetColumn });
    useBoardStore.getState().setOverId(over.id);
  };

  const handleDragEnd = () => {
    const state = drag.current;
    drag.current = null;
    useBoardStore.getState().setActiveTask(null);
    useBoardStore.getState().setOverId(null);

    if (!state) return;
    const { task, targetColumn, overId } = state;

    if (task.column === targetColumn) {
      rqClient.setQueriesData<{ pages: TasksPage[] }>(
        { queryKey: ["tasks", task.column] },
        (old) => {
          if (!old) return old;
          const firstPage = old.pages[0];
          const tasks = [...(firstPage?.data ?? [])];
          const fromIndex = tasks.findIndex((t) => t.id === task.id);
          const overIndex = tasks.findIndex((t) => t.id === overId);
          if (fromIndex === -1 || overIndex === -1 || fromIndex === overIndex) return old;
          tasks.splice(fromIndex, 1);
          tasks.splice(overIndex, 0, task);
          return { ...old, pages: [{ ...firstPage, data: tasks }, ...old.pages.slice(1)] };
        },
      );
      return;
    }

    rqClient.setQueriesData<{ pages: TasksPage[] }>(
      { queryKey: ["tasks", task.column] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({ ...p, data: p.data.filter((t) => t.id !== task.id) })),
        };
      },
    );

    rqClient.setQueriesData<{ pages: TasksPage[] }>(
      { queryKey: ["tasks", targetColumn] },
      (old) => {
        if (!old) return old;
        const firstPage = old.pages[0];
        const tasks = [...(firstPage?.data ?? [])];
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const insertAt = overIndex >= 0 ? overIndex : tasks.length;
        tasks.splice(insertAt, 0, { ...task, column: targetColumn });
        return { ...old, pages: [{ ...firstPage, data: tasks }, ...old.pages.slice(1)] };
      },
    );

    moveTask({ id: task.id, column: targetColumn });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragEnd}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          p: { xs: 2, sm: 3 },
          overflowX: { md: "auto" },
          alignItems: "flex-start",
          minHeight: "calc(100vh - 64px)",
          bgcolor: "background.default",
        }}
      >
        {COLUMNS.map((col) => (
          <BoardColumn key={col} column={col} />
        ))}
      </Box>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>

      <TaskDialog />
      <DeleteConfirmDialog />
    </DndContext>
  );
}
