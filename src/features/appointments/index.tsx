import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { CalendarCheck, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllAppointments } from '@/api'
import type { AppointmentResponse } from '@/api'
import { AppointmentsTable } from './components/appointments-table'

const route = getRouteApi('/_authenticated/appointments/')

export function Appointments() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10

  const queryParams = useMemo(() => {
    const params: any = {
      pageable: {
        page: page - 1,
        size: pageSize,
      },
    }
    return params
  }, [page, pageSize])

  const { data: response, isLoading } = useGetAllAppointments(queryParams as any, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const appointments = (response?.content || []) as AppointmentResponse[]
  const totalPages = response?.page?.totalPages || 0

  const stats = useMemo(() => {
    return {
      pending: appointments.filter((a) => a.status === 'PENDING_CONFIRMATION').length,
      confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
      completed: appointments.filter((a) => a.status === 'COMPLETED').length,
      disputed: appointments.filter((a) => a.status === 'DISPUTED').length,
    }
  }, [appointments])

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
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Lịch hẹn</h2>
          <p className='text-muted-foreground'>
            Quản lý tất cả lịch hẹn trong hệ thống.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Chờ xác nhận</CardTitle>
              <Clock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Đã xác nhận</CardTitle>
              <CalendarCheck className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.confirmed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Hoàn thành</CardTitle>
              <CheckCircle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Tranh chấp</CardTitle>
              <AlertTriangle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.disputed}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <AppointmentsTable
            data={appointments}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>
    </>
  )
}
