import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetMyTrainers, type GetMyTrainersQueryParams } from '@/api'
import { MyTrainersProvider, useMyTrainers } from './components/my-trainers-provider'
import { MyTrainersTable } from './components/my-trainers-table'
import { TrainerPreviewDialog } from './components/trainer-preview-dialog'

const route = getRouteApi('/_authenticated/my-trainers/')

function MyTrainersContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { open, setOpen, currentTrainer } = useMyTrainers()

  const page = (search.page ?? 1) - 1
  const pageSize = search.pageSize ?? 10
  const query = search.query?.trim()

  const queryParams = useMemo<GetMyTrainersQueryParams>(
    () => ({
      pageable: {
        page,
        size: pageSize,
      },
      ...(query && { query }),
    }),
    [page, pageSize, query]
  )

  const { data, isLoading } = useGetMyTrainers(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const trainers = data?.content ?? []
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
            <h2 className='text-2xl font-bold tracking-tight'>Huấn luyện viên của tôi</h2>
            <p className='text-muted-foreground'>
              Quản lý danh sách huấn luyện viên được phân công.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <span className='text-muted-foreground'>Đang tải...</span>
          </div>
        ) : (
          <MyTrainersTable
            data={trainers}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

      {/* Trainer Preview Dialog */}
      <TrainerPreviewDialog
        trainer={currentTrainer}
        open={open === 'preview'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'preview' : null)}
      />
    </>
  )
}

export function MyTrainers() {
  return (
    <MyTrainersProvider>
      <MyTrainersContent />
    </MyTrainersProvider>
  )
}
