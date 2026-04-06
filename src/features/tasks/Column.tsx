import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import { Box, Typography, Button, Paper, Divider } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useAppDispatch } from "../../app/hooks"
import { openCreateModal } from "./tasksSlice"
import { TaskCard } from "./TaskCard"
import type { Task, ColumnConfig } from "../../types/Task"
import { PAGE_SIZE } from "../../types/Task"

type ColumnProps = {
  config: ColumnConfig
  tasks: Task[]
}

export function Column({ config, tasks }: ColumnProps) {
  const dispatch = useAppDispatch()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleTasks = tasks.slice(0, visibleCount)
  const hasMore = tasks.length > visibleCount

  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        minWidth: 280,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        p: 1.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ letterSpacing: 1, textTransform: "uppercase", fontSize: "0.7rem" }}
        >
          {config.label}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 0.5 }}
        >
          {tasks.length}
        </Typography>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      <Droppable droppableId={config.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 60,
              flex: 1,
              backgroundColor: snapshot.isDraggingOver ? "#eee" : "transparent",
              borderRadius: 1,
              transition: "background-color 0.2s",
              px: 0.5,
            }}
          >
            {visibleTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {/* Load more button - only shown if there are hidden tasks */}
      {hasMore && (
        <Button
          size="small"
          sx={{ mt: 1, textTransform: "none" }}
          onClick={() => {
            setVisibleCount((prev) => prev + PAGE_SIZE)
          }}
        >
          Load {Math.min(PAGE_SIZE, tasks.length - visibleCount)} more...
        </Button>
      )}

      <Button
        size="small"
        startIcon={<AddIcon />}
        sx={{ mt: 1, textTransform: "none" }}
        onClick={() => dispatch(openCreateModal())}
      >
        Add task
      </Button>
    </Paper>
  )
}
