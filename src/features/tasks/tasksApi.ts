import type { Task, NewTask } from "../../types/Task"

const BASE_URL = "http://localhost:4000"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API error: ${String(res.status)} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// GET tasks
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`)
  return handleResponse<Task[]>(res)
}

// POST task
export async function createTask(task: NewTask): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return handleResponse<Task>(res)
}

// PATCH task:id
export async function updateTask(task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return handleResponse<Task>(res)
}

// DELETE task:id
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    throw new Error(`Delete failed: ${String(res.status)} ${res.statusText}`)
  }
}
