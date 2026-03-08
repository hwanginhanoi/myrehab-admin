import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useGetAllBanners,
  type GetAllBannersQueryParams,
} from '@/api'
import { BannersPrimaryButtons } from './components/banners-primary-buttons'
import { BannersTable } from './components/banners-table'
import { BannersDialogs } from './components/banners-dialogs'

const route = getRouteApi('/_authenticated/banners/')

export function Banners() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  const status = search.status as string | undefined
  const title = (search.title as string | undefined)?.trim()

  const queryParams = useMemo(
    () =>
      ({
        pageable: {
          page: page - 1,
          size: pageSize,
        },
        ...(status && { status }),
        ...(title && { title }),
      }) as GetAllBannersQueryParams,
    [page, pageSize, status, title]
  )

  const { data: response, isLoading } = useGetAllBanners(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const banners = response?.content || []
  const totalPages = response?.page?.totalPages || 0

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Quản lý banner
            </h2>
            <p className="text-muted-foreground">
              Quản lý banner hiển thị trên ứng dụng di động.
            </p>
          </div>
          <BannersPrimaryButtons />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <BannersTable
            data={banners}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

      <BannersDialogs />
    </>
  )
}
