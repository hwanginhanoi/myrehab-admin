import { createFileRoute } from '@tanstack/react-router'
import { DoctorTrainerSection } from '@/features/staff/doctor-detail/components/doctor-trainer-section'

function DoctorTrainersRoute() {
  const { doctorId } = Route.useParams()

  return <DoctorTrainerSection doctorId={Number(doctorId)} />
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/trainers'
)({
  component: DoctorTrainersRoute,
})
