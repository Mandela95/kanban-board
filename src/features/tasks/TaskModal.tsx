import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material"
import { useMutation, useQueryClient } from "react-query"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { closeModal, selectIsModalOpen, selectSelectedTask } from "./tasksSlice"
import { createTask, updateTask } from "./tasksApi"
import type { Column, Priority } from "../../types/Task"

export function TaskModal() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsModalOpen)
  const selectedTask = useAppSelector(selectSelectedTask)
  const queryClient = useQueryClient()

  const isEditing = selectedTask !== null

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [column, setColumn] = useState<Column>("backlog")
  const [priority, setPriority] = useState<Priority>("medium")

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title)
      setDescription(selectedTask.description)
      setColumn(selectedTask.column)
      setPriority(selectedTask.priority)
    } else {
      // Reset data
      setTitle("")
      setDescription("")
      setColumn("backlog")
      setPriority("medium")
    }
  }, [selectedTask, isOpen])

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["tasks"])
      dispatch(closeModal())
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["tasks"])
      dispatch(closeModal())
    },
  })

  function handleSubmit() {
    if (!title.trim()) return

    if (isEditing) {
      updateMutation.mutate({
        ...selectedTask,
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
      })
    } else {
      createMutation.mutate({
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
      })
    }
  }

  const isPending = createMutation.isLoading || updateMutation.isLoading

  return (
    <Dialog
      open={isOpen}
      onClose={() => dispatch(closeModal())}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => { setTitle(e.target.value) }}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
            fullWidth
            multiline
            rows={3}
          />

          <FormControl fullWidth>
            <InputLabel>Column</InputLabel>
            <Select
              value={column}
              label="Column"
              onChange={(e) => { setColumn(e.target.value as Column) }}
            >
              <MenuItem value="backlog">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="review">In Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => { setPriority(e.target.value as Priority) }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => dispatch(closeModal())} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
        >
          {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
