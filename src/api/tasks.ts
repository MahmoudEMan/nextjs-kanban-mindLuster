import { http } from "./http";
import type { FetchTasksParams, Task, TasksPage } from "@/types";

export async function fetchTasks({
  column,
  page = 1,
  search = "",
  limit = 8,
}: FetchTasksParams): Promise<TasksPage> {
  const params = new URLSearchParams({
    column,
    _page: String(page),
    _limit: String(limit),
  });
  if (search.trim()) params.set("q", search.trim());

  const { data, headers } = await http.getWithHeaders<Task[]>(
    `/tasks?${params}`,
  );
  const total = Number(headers.get("X-Total-Count") ?? 0);
  return { data, total };
}

export const createTask = (task: Omit<Task, "id">) =>
  http.post<Task>("/tasks", task);

export const updateTask = (id: number, patch: Partial<Omit<Task, "id">>) =>
  http.patch<Task>(`/tasks/${id}`, patch);

export const deleteTask = (id: number) => http.delete(`/tasks/${id}`);
