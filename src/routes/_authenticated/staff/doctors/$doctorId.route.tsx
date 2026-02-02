import { createFileRoute, type SearchSchemaInput } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DoctorDetail } from '@/features/staff/doctor-detail'

function DoctorDetailRoute() {
  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <DoctorDetail />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/staff/doctors/$doctorId')({
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => ({
    mode: (search.mode as 'view' | 'edit') || 'view',
  }),
  component: DoctorDetailRoute,
})
