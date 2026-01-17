import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllNews, type GetAllNewsQueryParams } from '@/api'
import { NewsPrimaryButtons } from './components/news-primary-buttons'
import { NewsTable } from './components/news-table'

const route = getRouteApi('/_authenticated/news/')

export function News() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Get pagination params from URL or use defaults
  // Note: URL uses 1-indexed pages, but API expects 0-indexed
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  const status = search.status as string | undefined
  const category = search.category as string | undefined
  const title = (search.title as string | undefined)?.trim()

  // Build query params with proper structure matching GetAllNewsQueryParams
  const queryParams = useMemo<GetAllNewsQueryParams>(() => ({
    pageable: {
      page: page - 1, // Convert to 0-indexed for API
      size: pageSize,
    },
    ...(status && { status: status as GetAllNewsQueryParams['status'] }),
    ...(category && { category }),
    ...(title && { title }),
  }), [page, pageSize, status, category, title])

  // Fetch news with server-side filtering and pagination
  const { data: response, isLoading } = useGetAllNews(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const news = response?.content || []
  const totalPages = response?.page?.totalPages || 0

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
            <h2 className='text-2xl font-bold tracking-tight'>Quản lý tin tức</h2>
            <p className='text-muted-foreground'>
              Quản lý tin tức và bài viết của hệ thống.
            </p>
          </div>
          <NewsPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <NewsTable
            data={news}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>
    </>
  )
}
