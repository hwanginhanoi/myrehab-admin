import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DoctorTrainerSection } from '@/features/staff/doctor-detail/components/doctor-trainer-section'

const doctorTrainersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
  // TODO: Add search support when backend API supports it
  // query: z.string().optional().catch(undefined),
})

function DoctorTrainersRoute() {
  const { doctorId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <DoctorTrainerSection
      doctorId={Number(doctorId)}
      search={search}
      navigate={navigate}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/trainers'
)({
  component: DoctorTrainersRoute,
  validateSearch: doctorTrainersSearchSchema,
})
