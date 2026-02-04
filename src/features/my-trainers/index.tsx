import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useGetMyTrainers1, type StaffResponse, type GetMyTrainers1QueryParams } from '@/api'
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

  const queryParams = useMemo<GetMyTrainers1QueryParams>(
    () => ({
      pageable: {
        page,
        size: pageSize,
      },
      ...(query && { query }),
    }),
    [page, pageSize, query]
  )

  const { data, isLoading } = useGetMyTrainers1(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const trainers = (data?.content ?? []) as StaffResponse[]
  const totalPages = data?.page?.totalPages ?? 0

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold'>Huấn luyện viên của tôi</h1>
        </div>
      </Header>
      <Main fixed>
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
