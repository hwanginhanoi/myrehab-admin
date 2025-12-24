import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllExercisePackages } from '@/api'
import { ExercisePackagesPrimaryButtons } from './components/exercise-packages-primary-buttons'
import { ExercisePackagesTable } from './components/exercise-packages-table'

const route = getRouteApi('/_authenticated/exercise-packages/')

export function ExercisePackages() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Get pagination params from URL or use defaults
  // Note: URL uses 1-indexed pages, but API expects 0-indexed
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  const title = search.title as string | undefined

  // Build query params - include filters if present
  const queryParams = useMemo(() => {
    const params: any = {
      pageable: {
        page: page - 1, // Convert to 0-indexed for API
        size: pageSize,
      },
    }

    // Add search query if present
    if (title && title.trim()) {
      params.query = title.trim()
    }

    return params
  }, [page, pageSize, title])

  // Fetch exercise packages with server-side filtering and pagination
  const { data: response, isLoading } = useGetAllExercisePackages(queryParams as any, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const exercisePackages = response?.content || []
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
            <h2 className='text-2xl font-bold tracking-tight'>Gói bài tập</h2>
            <p className='text-muted-foreground'>
              Quản lý gói bài tập phục hồi chức năng.
            </p>
          </div>
          <ExercisePackagesPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <ExercisePackagesTable
            data={exercisePackages}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>
    </>
  )
}
