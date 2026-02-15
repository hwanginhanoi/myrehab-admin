import { useNavigate } from '@tanstack/react-router'
import { getRouteApi } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useGetAppointmentById } from '@/api'
import { AppointmentInfoCard } from './components/appointment-info-card'
import { AppointmentTimeline } from './components/appointment-timeline'
import { AppointmentActions } from './components/appointment-actions'

const route = getRouteApi('/_authenticated/appointments/$id')

export function AppointmentDetail() {
  const { id } = route.useParams()
  const navigate = useNavigate()

  const { data: appointment, isLoading } = useGetAppointmentById(Number(id))

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
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/appointments' })}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Chi tiết lịch hẹn
            </h2>
            <p className='text-muted-foreground'>
              Xem và quản lý thông tin lịch hẹn.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : appointment ? (
          <div className='grid gap-4 lg:grid-cols-3'>
            <div className='lg:col-span-2 space-y-4'>
              <AppointmentInfoCard appointment={appointment} />
              <AppointmentActions appointment={appointment} />
            </div>
            <div>
              <AppointmentTimeline appointment={appointment} />
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Không tìm thấy lịch hẹn</p>
          </div>
        )}
      </Main>
    </>
  )
}
