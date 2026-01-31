import { Button } from '@/components/ui/button'
import { UserPlus, Loader2 } from 'lucide-react'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useGetDoctorPatients, type DoctorPatientResponse } from '@/api'
import { useDoctorDetail } from './doctor-detail-provider'
import { PatientsTable } from './patients-table'

type PatientListCardProps = {
  doctorId: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PatientListCard({
  doctorId,
  search,
  navigate,
}: PatientListCardProps) {
  const { setOpen } = useDoctorDetail()

  // Extract pagination params from URL
  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10

  // Use paginated API
  const { data, isLoading } = useGetDoctorPatients(
    doctorId,
    { pageable: { page: page - 1, size: pageSize } }
  )

  const patients = (data?.content as DoctorPatientResponse[]) || []
  const pageCount = data?.page?.totalPages || 0
  const totalCount = data?.page?.totalElements || 0

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>
            {isLoading ? 'Đang tải...' : `${totalCount} bệnh nhân`}
          </p>
        </div>
        <Button
          onClick={() => setOpen('assignPatient')}
          size='sm'
          disabled={isLoading}
        >
          <UserPlus className='mr-2 h-4 w-4' />
          Gán bệnh nhân
        </Button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center h-32 border rounded-md'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          <p className='text-sm text-muted-foreground'>Đang tải...</p>
        </div>
      ) : totalCount > 0 ? (
        <PatientsTable
          data={patients}
          search={search}
          navigate={navigate}
          pageCount={pageCount}
        />
      ) : (
        <div className='flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg'>
          <p className='text-sm text-muted-foreground text-center'>
            Chưa có bệnh nhân nào được gán.
            <br />
            Nhấn "Gán bệnh nhân" để thêm.
          </p>
        </div>
      )}
    </div>
  )
}
