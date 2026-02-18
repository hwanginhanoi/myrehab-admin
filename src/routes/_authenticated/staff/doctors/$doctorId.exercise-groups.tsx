import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { DoctorExerciseGroupSection } from '@/features/staff/doctor-detail/components/doctor-exercise-group-section'

const parentRoute = getRouteApi('/_authenticated/staff/doctors/$doctorId')

function DoctorExerciseGroupsRoute() {
  const { doctorId } = Route.useParams()
  const { mode } = parentRoute.useSearch()

  return (
    <DoctorExerciseGroupSection
      doctorId={Number(doctorId)}
      readOnly={mode === 'view'}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/staff/doctors/$doctorId/exercise-groups'
)({
  component: DoctorExerciseGroupsRoute,
})
