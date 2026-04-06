# Kanban Board — Next.js

Kanban-style task manager built with Next.js 14 App Router, Zustand, React Query, Material UI, and dnd-kit.

## Stack

- **Next.js 14** (App Router)
- **Zustand** — UI state (search, dialogs, drag overlay)
- **React Query** — server state, caching, infinite scroll
- **MUI v5** — components and layout
- **@dnd-kit** — drag and drop
- **json-server** — mock REST API

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock API

```bash
npm run api
# runs json-server on http://localhost:4000
```

### 3. Start the dev server

```bash
npm run dev
# runs on http://localhost:3000
```

Both servers need to be running at the same time.

## Project structure

```
src/
├── api/          # fetch wrappers
├── app/          # Next.js App Router
│   ├── layout.jsx
│   ├── page.jsx
│   └── providers.jsx   # QueryClient + MUI ThemeProvider (client boundary)
├── components/
│   ├── Board/    # Board + BoardColumn
│   └── Task/     # TaskCard + TaskDialog
├── hooks/        # useTasks + useTaskMutations
└── store/        # Zustand store
db.json           # json-server seed data
```

## Notes on Next.js App Router

All interactive components are Client Components (`'use client'`). Data fetching happens client-side via React Query — not via Server Components — to keep the cache shared across all four columns.

`providers.jsx` instantiates `QueryClient` inside `useState` to prevent a shared instance across server renders.

## Features

- 4 columns: Backlog, In Progress, Review, Done
- Create, edit, delete tasks
- Drag and drop between columns (optimistic update)
- Infinite scroll per column (8 tasks/page)
- Debounced search across title and description
- React Query caching with 30s stale time
