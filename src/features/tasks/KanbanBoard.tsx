import { DragDropContext } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  setSearchQuery,
  openCreateModal,
  selectSearchQuery,
} from "./tasksSlice"
import { fetchTasks, updateTask } from "./tasksApi"
import { Column } from "./Column"
import { TaskModal } from "./TaskModal"
import { COLUMNS } from "../../types/Task"
import type { Task } from "../../types/Task"

export function KanbanBoard() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5,
  })

  // Optimistic update for drag-and-drop so the UI feels snappy
  const moveMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries(["tasks"])
      const previous = queryClient.getQueryData<Task[]>(["tasks"])
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      )
      return { previous }
    },
    onError: (_err, _task, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["tasks"])
    },
  })

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    if (destination.droppableId !== source.droppableId) {
      moveMutation.mutate({
        ...task,
        column: destination.droppableId as Task["column"],
      })
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const q = searchQuery.toLowerCase()
    return (
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q)
    )
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box m={4}>
        <Alert severity="error">
          Could not connect to the API.
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <Box
        sx={{
          px: 4,
          py: 2,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            KANBAN BOARD
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </Typography>
        </Box>

        <TextField
          placeholder="Search tasks..."
          size="small"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          sx={{ width: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => dispatch(openCreateModal())}
          sx={{ textTransform: "none" }}
        >
          New Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 3,
            overflowX: "auto",
            alignItems: "flex-start",
          }}
        >
          {COLUMNS.map((columnConfig) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.column === columnConfig.id,
            )
            return (
              <Column
                key={columnConfig.id}
                config={columnConfig}
                tasks={columnTasks}
              />
            )
          })}
        </Box>
      </DragDropContext>

      <TaskModal />
    </Box>
  )
}
