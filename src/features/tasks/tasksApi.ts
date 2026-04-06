import type { Task, NewTask } from "../../types/Task"

const IS_PROD = import.meta.env.PROD
const BASE_URL = "http://localhost:4000"
const STORAGE_KEY = "kanban-tasks"

const SEED_TASKS: Task[] = [
  { id: "1", title: "Test", description: "frontend", column: "backlog", priority: "high" },
  { id: "4", title: "MUI", description: "design", column: "in_progress", priority: "low" },
  { id: "7", title: "redux", description: "store", column: "done", priority: "medium" },
  { id: "8", title: "crud", description: "all working fine", column: "review", priority: "medium" },
  { id: "9", title: "React", description: "test", column: "in_progress", priority: "medium" },
  { id: "10", title: "Node js", description: "backend", column: "in_progress", priority: "high" },
]

function getLocalTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored) as Task[]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TASKS))
  return SEED_TASKS
}

function saveLocalTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API error: ${String(res.status)} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function fetchTasks(): Promise<Task[]> {
  if (IS_PROD) return Promise.resolve(getLocalTasks())
  const res = await fetch(`${BASE_URL}/tasks`)
  return handleResponse<Task[]>(res)
}

export async function createTask(task: NewTask): Promise<Task> {
  if (IS_PROD) {
    const newTask: Task = { ...task, id: generateId() }
    const tasks = getLocalTasks()
    saveLocalTasks([...tasks, newTask])
    return Promise.resolve(newTask)
  }
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return handleResponse<Task>(res)
}

export async function updateTask(task: Task): Promise<Task> {
  if (IS_PROD) {
    const tasks = getLocalTasks().map((t) => (t.id === task.id ? task : t))
    saveLocalTasks(tasks)
    return Promise.resolve(task)
  }
  const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return handleResponse<Task>(res)
}

export async function deleteTask(id: string): Promise<void> {
  if (IS_PROD) {
    saveLocalTasks(getLocalTasks().filter((t) => t.id !== id))
    return Promise.resolve()
  }
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" })
  if (!res.ok) {
    throw new Error(`Delete failed: ${String(res.status)} ${res.statusText}`)
  }
}
