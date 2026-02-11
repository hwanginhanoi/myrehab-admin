import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import {
  useGetAllTransactionHistory,
  type GetAllTransactionHistoryQueryParams,
} from '@/api'
import { TransactionsTable } from './components/transactions-table'

const route = getRouteApi('/_authenticated/transactions/')

export function Transactions() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = search.page || 1
  const pageSize = search.pageSize || 10
  const userName = search.userName?.trim()
  const startDate = search.startDate
  const endDate = search.endDate

  const queryParams = useMemo<GetAllTransactionHistoryQueryParams>(
    () => ({
      pageable: {
        page: page - 1,
        size: pageSize,
      },
      ...(userName && { userName }),
      ...(startDate && { startDate: `${startDate}T00:00:00` }),
      ...(endDate && { endDate: `${endDate}T23:59:59` }),
    }),
    [page, pageSize, userName, startDate, endDate]
  )

  const { data: response, isLoading } = useGetAllTransactionHistory(
    queryParams,
    {
      query: {
        placeholderData: (previousData) => previousData,
      },
    }
  )

  const transactions = (response?.content as Record<string, unknown>[]) || []
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
            <h2 className='text-2xl font-bold tracking-tight'>
              Quản trị giao dịch
            </h2>
            <p className='text-muted-foreground'>
              Xem lịch sử giao dịch của tất cả người dùng.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <TransactionsTable
            data={transactions}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>
    </>
  )
}
