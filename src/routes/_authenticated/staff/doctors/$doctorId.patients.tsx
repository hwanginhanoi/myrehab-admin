import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { DoctorPatientSection } from '@/features/staff/doctor-detail/components/doctor-patient-section'

const parentRoute = getRouteApi('/_authenticated/staff/doctors/$doctorId')

function DoctorPatientsRoute() {
  const { doctorId } = Route.useParams()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const { mode } = parentRoute.useSearch()

  return (
    <DoctorPatientSection
      doctorId={Number(doctorId)}
      search={search}
      navigate={navigate}
      readOnly={mode === 'view'}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/patients'
)({
  component: DoctorPatientsRoute,
})
