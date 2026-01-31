import { createFileRoute } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { DoctorPermissionSection } from '@/features/staff/doctor-detail/components/doctor-permission-section'

function DoctorPermissionsRoute() {
  const { doctorId } = Route.useParams()

  const { data: doctor, isLoading, error } = useGetStaffById(Number(doctorId))

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <p className='text-muted-foreground'>Đang tải...</p>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className='flex items-center justify-center h-32'>
        <p className='text-destructive'>Không thể tải thông tin bác sĩ</p>
      </div>
    )
  }

  return <DoctorPermissionSection doctor={doctor} />
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/permissions'
)({
  component: DoctorPermissionsRoute,
})
