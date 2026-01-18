import { createFileRoute } from '@tanstack/react-router'
import { DoctorPatientSection } from '@/features/staff/doctor-detail/components/doctor-patient-section'

function DoctorPatientsRoute() {
  const { doctorId } = Route.useParams()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  return (
    <DoctorPatientSection
      doctorId={Number(doctorId)}
      search={search}
      navigate={navigate}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/patients'
)({
  component: DoctorPatientsRoute,
})
