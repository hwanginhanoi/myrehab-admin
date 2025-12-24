import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllCategories, useGetCategoriesByType } from '@/api'
import type { GetCategoriesByTypePathParams } from '@/api/types/exerciseCategoriesController/GetCategoriesByType'
import { CategoriesDialogs } from './components/categories-dialogs'
import { CategoriesPrimaryButtons } from './components/categories-primary-buttons'
import { CategoriesProvider } from './components/categories-provider'
import { CategoriesTable } from './components/categories-table'

const route = getRouteApi('/_authenticated/exercise-categories/')

export function ExerciseCategories() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Get pagination params from URL or use defaults
  // Note: URL uses 1-indexed pages, but API expects 0-indexed
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  const selectedType = search.type as string | undefined

  // Build query params for pagination
  const paginationParams = useMemo(() => ({
    page: page - 1, // Convert to 0-indexed for API
    size: pageSize,
  }), [page, pageSize])

  // Conditionally use the appropriate hook based on whether type filter is selected
  const { data: allCategoriesResponse, isLoading: isLoadingAll } = useGetAllCategories(
    paginationParams as any,
    {
      query: {
        enabled: !selectedType, // Only fetch when no type filter is selected
        placeholderData: (previousData) => previousData,
      }
    }
  )

  const { data: filteredCategoriesResponse, isLoading: isLoadingFiltered } = useGetCategoriesByType(
    selectedType as GetCategoriesByTypePathParams['type'],
    { pageable: paginationParams } as any,
    {
      query: {
        enabled: !!selectedType, // Only fetch when type filter is selected
        placeholderData: (previousData) => previousData,
      }
    }
  )

  // Use the appropriate response based on which query is enabled
  const response = selectedType ? filteredCategoriesResponse : allCategoriesResponse
  const isLoading = selectedType ? isLoadingFiltered : isLoadingAll

  const categories = response?.content || []
  const totalPages = response?.totalPages || 0

  return (
    <CategoriesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Danh mục bài tập</h2>
            <p className='text-muted-foreground'>
              Quản lý danh mục bài tập phục hồi chức năng.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <CategoriesTable
            data={categories}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
