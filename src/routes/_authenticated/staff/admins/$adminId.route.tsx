import { createFileRoute, type SearchSchemaInput } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AdminDetail } from '@/features/staff/admin-detail'

function AdminDetailRoute() {
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
        <AdminDetail />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/staff/admins/$adminId')({
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => ({
    mode: (search.mode as 'view' | 'edit') || 'view',
  }),
  component: AdminDetailRoute,
})
