import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetClinicSchedule } from '@/api'
import type { ClinicScheduleResponse } from '@/api'
import { ClinicScheduleTable } from './components/clinic-schedule-table'

export function ClinicSchedule() {
  const { data: response, isLoading } = useGetClinicSchedule()

  const schedules = (response || []) as ClinicScheduleResponse[]

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
          <h2 className='text-2xl font-bold tracking-tight'>Lịch phòng khám</h2>
          <p className='text-muted-foreground'>
            Quản lý giờ hoạt động của phòng khám theo từng ngày trong tuần.
          </p>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <ClinicScheduleTable data={schedules} />
        )}
      </Main>
    </>
  )
}
