import { useMemo } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetDoctorAppointments } from '@/api'
import type { AppointmentResponse } from '@/api'
import { DateNavigation } from './components/date-navigation'
import { DailyScheduleView } from './components/daily-schedule-view'

const route = getRouteApi('/_authenticated/my-appointments/')

export function MyAppointments() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const selectedDate = (search.date as string) || format(new Date(), 'yyyy-MM-dd')

  const { data: response, isLoading } = useGetDoctorAppointments(
    { pageable: { page: 0, size: 100 } } as any,
    {
      query: {
        placeholderData: (previousData) => previousData,
      },
    }
  )

  const allAppointments = (response?.content || []) as AppointmentResponse[]

  const filteredAppointments = useMemo(() => {
    return allAppointments.filter((a) => a.appointmentDate === selectedDate)
  }, [allAppointments, selectedDate])

  function handleDateChange(date: string) {
    navigate({
      search: (prev) => ({ ...prev, date }),
    })
  }

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
          <h2 className='text-2xl font-bold tracking-tight'>Lịch hẹn của tôi</h2>
          <p className='text-muted-foreground'>
            Xem và quản lý lịch hẹn được phân công cho bạn.
          </p>
        </div>

        <DateNavigation selectedDate={selectedDate} onDateChange={handleDateChange} />

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <DailyScheduleView appointments={filteredAppointments} />
        )}
      </Main>
    </>
  )
}
