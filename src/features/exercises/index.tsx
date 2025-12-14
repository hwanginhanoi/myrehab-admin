import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetExercises } from '@/api'
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

  // Build query params - include categoryId if present
  const queryParams = useMemo(() => {
    const params: any = {
      page: page - 1, // Convert to 0-indexed for API
      size: pageSize,
    }

    // Add categoryId as query parameter if filtering
    if (categoryId !== undefined && categoryId !== null) {
      params.categoryId = categoryId
    }

    return params
  }, [page, pageSize, categoryId])

  // Fetch exercises with server-side filtering and pagination
  const { data: response, isLoading } = useGetExercises(queryParams as any)

  const exercises = response?.content || []
  const totalPages = response?.totalPages || 0

  // Handler for category filter
  const handleCategoryIdChange = (id: number | undefined) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        categoryId: id !== undefined && id !== null ? id : undefined,
      }),
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
