import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Task } from "../../types/Task"

type TasksUIState = {
  searchQuery: string
  isModalOpen: boolean
  selectedTask: Task | null
}

const initialState: TasksUIState = {
  searchQuery: "",
  isModalOpen: false,
  selectedTask: null,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    openCreateModal(state) {
      state.selectedTask = null
      state.isModalOpen = true
    },
    openEditModal(state, action: PayloadAction<Task>) {
      state.selectedTask = action.payload
      state.isModalOpen = true
    },
    closeModal(state) {
      state.isModalOpen = false
      state.selectedTask = null
    },
  },
})

export const { setSearchQuery, openCreateModal, openEditModal, closeModal } =
  tasksSlice.actions

// Local type to avoid circular import with store.ts
type StateWithTasks = { tasks: TasksUIState }

export const selectSearchQuery = (state: StateWithTasks) =>
  state.tasks.searchQuery

export const selectIsModalOpen = (state: StateWithTasks) =>
  state.tasks.isModalOpen

export const selectSelectedTask = (state: StateWithTasks) =>
  state.tasks.selectedTask

export default tasksSlice.reducer
