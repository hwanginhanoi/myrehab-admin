import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllExercises } from '@/api'
import { ExercisesPrimaryButtons } from './components/exercises-primary-buttons'
import { ExercisesTable } from './components/exercises-table'

const route = getRouteApi('/_authenticated/exercises/')

export function Exercises() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Get pagination params from URL or use defaults
  // Note: URL uses 1-indexed pages, but API expects 0-indexed
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  const categoryId = search.categoryId as number | undefined

  // When NO filter: use server-side pagination
  // When filter IS applied: fetch all and filter client-side
  const { data: paginatedResponse, isLoading: isLoadingPaginated } = useGetAllExercises(
    {
      page: page - 1, // Convert to 0-indexed for API
      size: pageSize,
    } as any,
    {
      query: {
        enabled: !categoryId, // Only fetch when no category filter
      },
    }
  )

  // Fetch all exercises when filtering (for client-side filtering)
  const { data: allExercisesResponse, isLoading: isLoadingAll } = useGetAllExercises(
    {
      page: 0,
      size: 10000, // Fetch all exercises for filtering
    } as any,
    {
      query: {
        enabled: !!categoryId, // Only fetch when category filter is applied
      },
    }
  )

  // Determine which data to use
  const exercises = useMemo(() => {
    if (categoryId) {
      // Client-side filtering and pagination
      const allExercises = allExercisesResponse?.content || []
      const filtered = allExercises.filter((exercise) => {
        return exercise.categories?.some((cat) => cat.id === categoryId)
      })
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      return filtered.slice(startIndex, endIndex)
    }
    // Server-side pagination
    return paginatedResponse?.content || []
  }, [categoryId, allExercisesResponse, paginatedResponse, page, pageSize])

  const totalPages = useMemo(() => {
    if (categoryId) {
      // Calculate from filtered results
      const allExercises = allExercisesResponse?.content || []
      const filtered = allExercises.filter((exercise) => {
        return exercise.categories?.some((cat) => cat.id === categoryId)
      })
      return Math.ceil(filtered.length / pageSize)
    }
    // Use server-provided total pages
    return paginatedResponse?.totalPages || 0
  }, [categoryId, allExercisesResponse, paginatedResponse, pageSize])

  const isLoading = categoryId ? isLoadingAll : isLoadingPaginated

  // Handler for category filter
  const handleCategoryIdChange = (id: number | undefined) => {
    navigate({
      search: (prev) => {
        const newSearch = { ...prev, page: 1 }

        if (id !== undefined && id !== null) {
          newSearch.categoryId = id
        } else {
          delete newSearch.categoryId
        }

        return newSearch
      },
    })
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Bài tập</h2>
            <p className='text-muted-foreground'>
              Quản lý bài tập phục hồi chức năng.
            </p>
          </div>
          <ExercisesPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <ExercisesTable
            data={exercises}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
            categoryId={categoryId}
            onCategoryIdChange={handleCategoryIdChange}
          />
        )}
      </Main>
    </>
  )
}
