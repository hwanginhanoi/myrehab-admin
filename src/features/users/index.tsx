import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllUsers, type GetAllUsersQueryParams } from '@/api'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const route = getRouteApi('/_authenticated/users/')

function UsersContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = (search.page ?? 1) - 1
  const pageSize = search.pageSize ?? 10
  const query = search.query?.trim()
  const gender = search.gender

  const queryParams = useMemo<GetAllUsersQueryParams>(
    () => ({
      pageable: {
        page,
        size: pageSize,
      },
      ...(query && { query }),
      ...(gender && { gender }),
    }),
    [page, pageSize, query, gender]
  )

  const { data, isLoading } = useGetAllUsers(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const users = (data?.content ?? []) as import('@/api').UserResponse[]
  const totalPages = data?.page?.totalPages ?? 0

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
              Quản lý người dùng
            </h2>
            <p className='text-muted-foreground'>
              Quản lý thông tin người dùng trong hệ thống.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <span className='text-muted-foreground'>Đang tải...</span>
          </div>
        ) : (
          <UsersTable
            data={users}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

    </>
  )
}

export function Users() {
  return (
    <UsersProvider>
      <UsersContent />
    </UsersProvider>
  )
}
