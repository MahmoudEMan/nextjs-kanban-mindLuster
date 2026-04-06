# Kanban Board — Next.js

A kanban-style task manager built with Next.js App Router. No backend required — all data is stored in `localStorage` with seed tasks on first load, making it instantly deployable on Vercel.

> **Note:** This is a frontend-only demo — no backend required. Tasks are persisted in `localStorage` and seeded automatically on first load. You can deploy it directly to Vercel with zero configuration.

## Stack

- **Next.js 15** (App Router)
- **Zustand** — UI state (search, dialogs, drag overlay)
- **React Query** — data fetching, caching, infinite scroll
- **MUI v5** — components and layout
- **@dnd-kit** — drag and drop
- **localStorage** — client-side persistence (no backend)

## Getting started

```bash
npm install
npm run dev
# runs on http://localhost:3000
```

No second server needed.

## Project structure

```
src/
├── api/
│   └── tasks.ts        # CRUD functions (delegates to localStorage)
├── lib/
│   └── storage.ts      # localStorage read/write with seed data
├── app/                # Next.js App Router (layout, page, providers)
├── components/
│   ├── Board/          # Board + BoardColumn
│   └── Task/           # TaskCard + TaskDialog
├── hooks/              # useTasks + useTaskMutations (React Query)
└── store/              # Zustand store
```

## Features

- 4 columns: Backlog, In Progress, Review, Done
- Create, edit, delete tasks
- Drag and drop between columns (optimistic update)
- Infinite scroll per column (8 tasks/page)
- Debounced search across title and description
- Data persists across page refreshes via `localStorage`
- Ships with 10 seed tasks on first load

## Notes on Next.js App Router

All interactive components are Client Components (`'use client'`). Data fetching happens client-side via React Query — not Server Components — so the cache is shared across all four columns.

`providers.tsx` instantiates `QueryClient` inside `useState` to prevent a shared instance across server renders.
