export type Column = "backlog" | "in_progress" | "review" | "done"

export type Priority = "low" | "medium" | "high"

export type Task = {
  id: string
  title: string
  description: string
  column: Column
  priority: Priority
}

export type NewTask = Omit<Task, "id">

export type ColumnConfig = {
  id: Column
  label: string
}

export const COLUMNS: ColumnConfig[] = [
  { id: "backlog", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "In Review" },
  { id: "done", label: "Done"},
]

export const PAGE_SIZE = 2
