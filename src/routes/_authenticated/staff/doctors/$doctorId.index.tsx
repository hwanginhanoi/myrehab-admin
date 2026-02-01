import { createFileRoute } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { DoctorProfileSection } from '@/features/staff/doctor-detail/components/doctor-profile-section'

function DoctorProfileRoute() {
  const { doctorId } = Route.useParams()
  const { mode } = Route.useSearch()
  const { data: doctor, isLoading } = useGetStaffById(Number(doctorId))

  if (!doctor) {
    return null
  }

  return <DoctorProfileSection doctor={doctor} isLoading={isLoading} readOnly={mode === 'view'} />
}

export const Route = createFileRoute('/_authenticated/staff/doctors/$doctorId/')({
  component: DoctorProfileRoute,
})
