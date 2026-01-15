import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useGetStaffById, useGetTrainersByDoctor } from '@/api'
import { DoctorDetailProvider, useDoctorDetail } from './components/doctor-detail-provider'
import { DoctorInfoCard } from './components/doctor-info-card'
import { TrainerListCard } from './components/trainer-list-card'
import { TrainerAssignmentDialog } from './components/trainer-assignment-dialog'
import { TrainerRemovalDialog } from './components/trainer-removal-dialog'

const route = getRouteApi('/_authenticated/staff/doctors/$doctorId')

function DoctorDetailContent() {
  const { doctorId } = route.useParams()
  const navigate = route.useNavigate()
  const { open, setOpen, currentTrainer } = useDoctorDetail()

  // Fetch doctor data
  const { data: doctor, isLoading, error } = useGetStaffById(Number(doctorId))

  // Fetch trainers to get assigned IDs
  const { data: trainers } = useGetTrainersByDoctor(Number(doctorId))

  const assignedTrainerIds = useMemo(() => {
    return trainers?.map((t) => t.id).filter((id): id is number => id !== undefined) || []
  }, [trainers])

  // Handle error states
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>Không tìm thấy bác sĩ</p>
        <Button
          onClick={() =>
            navigate({
              to: '/staff',
            })
          }
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách nhân viên
        </Button>
      </div>
    )
  }

  // Check if the staff member is actually a doctor
  if (doctor && doctor.staffType !== 'DOCTOR') {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>
          Nhân viên này không phải là bác sĩ
        </p>
        <Button
          onClick={() =>
            navigate({
              to: '/staff',
            })
          }
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách nhân viên
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            navigate({
              to: '/staff',
            })
          }
          className='h-8 gap-1'
        >
          <ChevronLeft className='h-4 w-4' />
          Nhân viên
        </Button>
        <span>/</span>
        <span className='text-foreground font-medium'>Chi tiết bác sĩ</span>
      </div>

      {/* Page Header */}
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isLoading ? 'Đang tải...' : doctor?.fullName || 'Chi tiết Bác sĩ'}
          </h2>
          <p className='text-muted-foreground'>
            Xem thông tin bác sĩ và quản lý huấn luyện viên được gán.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className='grid grid-cols-1 gap-4 sm:gap-6'>
        {/* Doctor Info Card */}
        {doctor && <DoctorInfoCard doctor={doctor} isLoading={isLoading} />}

        {/* Trainer List Card */}
        <TrainerListCard doctorId={Number(doctorId)} />
      </div>

      {/* Dialogs */}
      <TrainerAssignmentDialog
        doctorId={Number(doctorId)}
        open={open === 'assign'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'assign' : null)}
        assignedTrainerIds={assignedTrainerIds}
      />

      <TrainerRemovalDialog
        doctorId={Number(doctorId)}
        trainer={currentTrainer}
        open={open === 'remove'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'remove' : null)}
      />
    </>
  )
}

export function DoctorDetail() {
  return (
    <DoctorDetailProvider>
      <DoctorDetailContent />
    </DoctorDetailProvider>
  )
}
