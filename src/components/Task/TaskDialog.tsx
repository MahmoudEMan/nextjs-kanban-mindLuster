"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import useBoardStore from "@/store/useBoardStore";
import { useCreateTask, useUpdateTask } from "@/hooks/useTaskMutations";
import { COLUMN_CONFIG, COLUMNS } from "@/constants/columns";
import type { Column, Task } from "@/types";

interface FormState {
  title: string;
  description: string;
  column: Column;
}

const defaultForm: FormState = {
  title: "",
  description: "",
  column: "backlog",
};

export default function TaskDialog() {
  const dialog = useBoardStore((s) => s.dialog);
  const closeDialog = useBoardStore((s) => s.closeDialog);

  const { mutate: createTask, isPending: creating } = useCreateTask();
  const { mutate: updateTask, isPending: updating } = useUpdateTask();

  const [form, setForm] = useState<FormState>(defaultForm);

  useEffect(() => {
    if (dialog.open) {
      setForm(
        dialog.task
          ? {
              title: dialog.task.title ?? "",
              description: dialog.task.description ?? "",
              column: dialog.task.column ?? "backlog",
            }
          : defaultForm,
      );
    }
  }, [dialog.open, dialog.task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (dialog.mode === "create") {
      createTask(form);
    } else {
      updateTask({ id: (dialog.task as Task).id, ...form });
    }
  };

  const isLoading = creating || updating;

  return (
    <Dialog open={dialog.open} onClose={closeDialog} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {dialog.mode === "create" ? "Add Task" : "Edit Task"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            autoFocus
            fullWidth
            size="small"
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            multiline
            rows={3}
            fullWidth
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Column</InputLabel>
            <Select<Column>
              value={form.column}
              label="Column"
              onChange={(e) =>
                setForm((f) => ({ ...f, column: e.target.value as Column }))
              }
            >
              {COLUMNS.map((col) => (
                <MenuItem key={col} value={col}>
                  {COLUMN_CONFIG[col].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : dialog.mode === "create"
                ? "Add Task"
                : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
