import { Button } from '@/components/ui/button'
import { UserPlus, Loader2 } from 'lucide-react'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useGetTrainersByDoctor, type TrainerResponse } from '@/api'
import { useDoctorDetail } from './doctor-detail-provider'
import { TrainersTable } from './trainers-table'

type TrainerListCardProps = {
  doctorId: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function TrainerListCard({
  doctorId,
  search,
  navigate,
}: TrainerListCardProps) {
  const { setOpen } = useDoctorDetail()

  // Extract pagination params from URL
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10
  // TODO: Add search support when backend API supports it
  // const query = (search.query as string) || undefined

  // Use paginated API
  const { data, isLoading } = useGetTrainersByDoctor(
    doctorId,
    { pageable: { page: page - 1, size: pageSize } }
  )

  const trainers = (data?.content as TrainerResponse[]) || []
  const pageCount = data?.page?.totalPages || 0
  const totalCount = data?.page?.totalElements || 0

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>
            {isLoading ? 'Đang tải...' : `${totalCount} huấn luyện viên`}
          </p>
        </div>
        <Button
          onClick={() => setOpen('assign')}
          size='sm'
          disabled={isLoading}
        >
          <UserPlus className='mr-2 h-4 w-4' />
          Gán huấn luyện viên
        </Button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center h-32 border rounded-md'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <p className='text-sm text-muted-foreground'>Đang tải...</p>
        </div>
      ) : totalCount > 0 ? (
        <TrainersTable
          data={trainers}
          search={search}
          navigate={navigate}
          pageCount={pageCount}
        />
      ) : (
        <div className='flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg'>
          <p className='text-sm text-muted-foreground text-center'>
            Chưa có huấn luyện viên nào được gán.
            <br />
            Nhấn "Gán huấn luyện viên" để thêm.
          </p>
        </div>
      )}
    </div>
  )
}
