import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllStaff, type GetAllStaffQueryParams } from '@/api'
import { StaffProvider } from './components/staff-provider'
import { StaffPrimaryButtons } from './components/staff-primary-buttons'
import { StaffTable } from './components/staff-table'
import { StaffDialogs } from './components/staff-dialogs'

const route = getRouteApi('/_authenticated/staff/')

export function Staff() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Get pagination params from URL or use defaults
  // Note: URL uses 1-indexed pages, but API expects 0-indexed
  const page = search.page || 1
  const pageSize = search.pageSize || 10
  const query = search.query?.trim()
  const staffTypes = search.staffType || []
  const statuses = search.status // Will be ['active'] by default from schema

  // Map status filter (active/inactive) to enabled boolean for API
  // If both selected or none selected, don't filter
  // If only 'active' selected, filter enabled=true
  // If only 'inactive' selected, filter enabled=false
  const enabledFilter =
    statuses.length === 1
      ? statuses[0] === 'active'
        ? true
        : false
      : undefined

  // Build query params with optional filters
  const queryParams = useMemo<GetAllStaffQueryParams>(
    () => ({
      pageable: {
        page: page - 1, // Convert to 0-indexed for API
        size: pageSize,
      },
      ...(query && { query }),
      // API expects single staffType, so take first if multiple selected
      ...(staffTypes.length > 0 && { staffType: staffTypes[0] }),
      ...(enabledFilter !== undefined && { enabled: enabledFilter }),
    }),
    [page, pageSize, query, staffTypes, enabledFilter]
  )

  // Fetch staff with server-side filtering and pagination
  const { data: response, isLoading } = useGetAllStaff(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const staff = response?.content || []
  const totalPages = response?.page?.totalPages || 0

  return (
    <StaffProvider>
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
              Quản lý Nhân viên
            </h2>
            <p className='text-muted-foreground'>
              Quản lý bác sĩ, huấn luyện viên và quản trị viên.
            </p>
          </div>
          <StaffPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <StaffTable
            data={staff}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

      <StaffDialogs />
    </StaffProvider>
  )
}
