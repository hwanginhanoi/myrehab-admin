import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAllGroups } from '@/api'
import { GroupsDialogs } from './components/groups-dialogs'
import { GroupsPrimaryButtons } from './components/groups-primary-buttons'
import { GroupsProvider } from './components/groups-provider'
import { GroupsTable } from './components/groups-table'

const route = getRouteApi('/_authenticated/exercise-groups/')

export function ExerciseGroups() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: groups, isLoading } = useGetAllGroups()

  return (
    <GroupsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Nhóm bài tập</h2>
            <p className='text-muted-foreground'>
              Quản lý nhóm bài tập phục hồi chức năng.
            </p>
          </div>
          <GroupsPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <GroupsTable
            data={groups || []}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <GroupsDialogs />
    </GroupsProvider>
  )
}
