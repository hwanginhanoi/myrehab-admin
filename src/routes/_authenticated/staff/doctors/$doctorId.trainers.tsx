import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { z } from 'zod'
import { DoctorTrainerSection } from '@/features/staff/doctor-detail/components/doctor-trainer-section'

const parentRoute = getRouteApi('/_authenticated/staff/doctors/$doctorId')

const doctorTrainersSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
})

function DoctorTrainersRoute() {
  const { doctorId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { mode } = parentRoute.useSearch()

  return (
    <DoctorTrainerSection
      doctorId={Number(doctorId)}
      search={search}
      navigate={navigate}
      readOnly={mode === 'view'}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/trainers'
)({
  component: DoctorTrainersRoute,
  validateSearch: doctorTrainersSearchSchema,
})
