import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetExercises, useGetAllCategories } from '@/api'
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
  const categoryIds = search.categoryIds as number[] | undefined

  // Fetch all categories for the filter (no pagination needed)
  const { data: categoriesResponse } = useGetAllCategories({
    page: 0,
    size: 1000, // Get all categories
  } as any)
  const allCategories = categoriesResponse?.content || []

  // Build query params - include categoryIds if present
  const queryParams = useMemo(() => {
    const params: any = {
      page: page - 1, // Convert to 0-indexed for API
      size: pageSize,
    }

    // Add categoryIds as query parameters if filtering
    // Note: API might expect multiple categoryId params or a different format
    // Adjust based on your API specification
    if (categoryIds && categoryIds.length > 0) {
      // If API supports array: params.categoryIds = categoryIds
      // If API needs comma-separated: params.categoryId = categoryIds.join(',')
      // For now, assuming it takes the first one (you may need to adjust)
      params.categoryId = categoryIds[0]
    }

    return params
  }, [page, pageSize, categoryIds])

  // Fetch exercises with server-side filtering and pagination
  const { data: response, isLoading } = useGetExercises(queryParams as any)

  const exercises = response?.content || []
  const totalPages = response?.totalPages || 0

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
            allCategories={allCategories}
          />
        )}
      </Main>
    </>
  )
}
