# Kanban Board

# Live server: https://mandela95.github.io/kanban-board/

A Kanban-style task management app built with React, Redux, React Query, and Material UI.

## Features

- 4 columns: To Do, In Progress, In Review, Done
- Create, edit, and delete tasks
- Drag and drop tasks between columns
- Search by title or description
- Pagination per column (load more)
- Cached data with React Query

## Tech Stack

- React 19 + TypeScript
- Redux Toolkit (UI state)
- React Query v3 (server state + caching)
- Material UI v7
- @hello-pangea/dnd (drag and drop)
- json-server (mock REST API)
- Vite

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Mandela95/kanban-board.git
cd kanban-board

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the mock API (runs on port 4000)
npm run mock-api

# 4. In a new terminal, start the app (runs on port 5173)
npm run dev
```

## Project Structure

```
src/
  app/
    store.ts          — Redux store setup
    hooks.ts          — Typed useAppDispatch / useAppSelector
  features/tasks/
    tasksApi.ts       — Fetch functions (GET, POST, PATCH, DELETE)
    tasksSlice.ts     — Redux slice for UI state (search, modal)
    KanbanBoard.tsx   — Main board with drag context and search
    Column.tsx        — Single column with pagination
    TaskCard.tsx      — Draggable task card
    TaskModal.tsx     — Create / edit dialog
  types/
    Task.ts           — TypeScript types and column config
db.json               — Mock database for json-server
```

## Scripts

| Command | Description |
| `npm run dev` | Start Vite dev server |
| `npm run mock-api` | Start json-server on port 4000 |
| `npm run build` | Build for production
