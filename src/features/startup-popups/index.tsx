import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useGetAllPopups,
  type GetAllPopupsQueryParams,
  type StartupPopupResponse,
} from '@/api'
import { StartupPopupsPrimaryButtons } from './components/startup-popups-primary-buttons'
import { StartupPopupsTable } from './components/startup-popups-table'
import { StartupPopupsDialogs } from './components/startup-popups-dialogs'

const route = getRouteApi('/_authenticated/startup-popups/')

export function StartupPopups() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10

  const queryParams = useMemo(
    () =>
      ({
        pageable: {
          page: page - 1,
          size: pageSize,
        },
      }) as GetAllPopupsQueryParams,
    [page, pageSize]
  )

  const { data: response, isLoading } = useGetAllPopups(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const popups = (response?.content as StartupPopupResponse[]) || []
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
              Quản lý Startup Popup
            </h2>
            <p className="text-muted-foreground">
              Quản lý popup hiển thị khi mở ứng dụng di động.
            </p>
          </div>
          <StartupPopupsPrimaryButtons />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <StartupPopupsTable
            data={popups}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

      <StartupPopupsDialogs />
    </>
  )
}
