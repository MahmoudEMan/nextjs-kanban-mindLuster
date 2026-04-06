
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTasks } from '@/api/tasks'
import useBoardStore from '@/store/useBoardStore'
import type { Column } from '@/types'

export function useTasks(column: Column) {
  const searchQuery = useBoardStore((s) => s.searchQuery)

  const query = useInfiniteQuery({
    queryKey: ['tasks', column, searchQuery] as const,
    queryFn: ({ pageParam }) =>
      fetchTasks({ column, page: pageParam, search: searchQuery }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((p) => p.data).length
      return loaded < lastPage.total ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  const tasks = query.data?.pages.flatMap((p) => p.data) ?? []

  return { ...query, tasks }
}
