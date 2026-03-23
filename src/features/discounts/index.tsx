import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import {
  useGetActiveDiscounts,
  useGetHistory,
  type GetHistoryQueryParams,
} from '@/api'
import { useGetPricing } from './hooks/use-get-pricing'
import { PricingTable } from './components/active-discounts-table'
import { HistoryTable } from './components/history-table'
import { DiscountsDialogs } from './components/discounts-dialogs'

const route = getRouteApi('/_authenticated/discounts/')

export function Discounts() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = search.page || 1
  const pageSize = search.pageSize || 10

  const historyParams = useMemo(
    () =>
      ({
        pageable: {
          page: page - 1,
          size: pageSize,
        },
      }) as GetHistoryQueryParams,
    [page, pageSize]
  )

  const { data: pricing, isLoading: isLoadingPricing } = useGetPricing()
  const { data: activeDiscounts } = useGetActiveDiscounts()

  const { data: historyResponse, isLoading: isLoadingHistory } = useGetHistory(
    historyParams,
    {
      query: {
        placeholderData: (previousData) => previousData,
      },
    }
  )

  const historyData = historyResponse?.content || []
  const totalPages = historyResponse?.page?.totalPages || 0

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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Quản lý giảm giá
          </h2>
          <p className="text-muted-foreground">
            Quản lý các chương trình giảm giá cho từng loại dịch vụ.
          </p>
        </div>

        {isLoadingPricing ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <PricingTable
            pricing={pricing || []}
            activeDiscounts={activeDiscounts || []}
          />
        )}

        {isLoadingHistory ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <HistoryTable
            data={historyData}
            page={page}
            pageCount={totalPages}
            onPageChange={(newPage) =>
              navigate({
                search: { page: newPage, pageSize },
              })
            }
          />
        )}
      </Main>

      <DiscountsDialogs />
    </>
  )
}
