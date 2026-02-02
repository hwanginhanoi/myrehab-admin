import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { DoctorPermissionSection } from '@/features/staff/doctor-detail/components/doctor-permission-section'

const parentRoute = getRouteApi('/_authenticated/staff/doctors/$doctorId')

function DoctorPermissionsRoute() {
  const { doctorId } = Route.useParams()
  const { mode } = parentRoute.useSearch()

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

  return <DoctorPermissionSection doctor={doctor} readOnly={mode === 'view'} />
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/permissions'
)({
  component: DoctorPermissionsRoute,
})
