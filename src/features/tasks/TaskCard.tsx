import { Draggable } from "@hello-pangea/dnd"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  Box,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { useMutation, useQueryClient } from "react-query"
import { useAppDispatch } from "../../app/hooks"
import { openEditModal } from "./tasksSlice"
import { deleteTask } from "./tasksApi"
import type { Task } from "../../types/Task"

type TaskCardProps = {
  task: Task
  index: number
}

const PRIORITY_COLORS = {
  low: { bg: "#e3f2fd", text: "#1565c0" },
  medium: { bg: "#e3f2fd", text: "#e65100" },
  high: { bg: "#e3f2fd", text: "#b71c1c" },
}

export function TaskCard({ task, index }: TaskCardProps) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["tasks"])
    },
  })

  const priorityStyle = PRIORITY_COLORS[task.priority]

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 1.5,
            cursor: "grab",
            boxShadow: snapshot.isDragging ? 6 : 1,
            transform: snapshot.isDragging ? "rotate(2deg)" : "none",
            transition: "box-shadow 0.2s, transform 0.2s",
            "&:active": { cursor: "grabbing" },
          }}
        >
          <CardContent sx={{ pb: "12px !important", pt: 1.5, px: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 0.5, fontFamily: "monospace" }}
            >
              {task.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.5, fontSize: "0.8rem" }}
            >
              {task.description}
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Chip
                label={task.priority.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: priorityStyle.bg,
                  color: priorityStyle.text,
                  fontWeight: "bold",
                  fontSize: "0.65rem",
                  height: 20,
                }}
              />

              <Stack direction="row" spacing={0}>
                {/* TODO: pre-fill the form with the data */}
                <IconButton
                  size="small"
                  onClick={() => dispatch(openEditModal(task))}
                  aria-label="edit task"
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => { deleteMutation.mutate()
                   }}
                  disabled={deleteMutation.isLoading}
                  aria-label="delete task"
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
