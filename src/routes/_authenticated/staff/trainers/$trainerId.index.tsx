import { createFileRoute } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { TrainerProfileSection } from '@/features/staff/trainer-detail/components/trainer-profile-section'

function TrainerProfileRoute() {
  const { trainerId } = Route.useParams()
  const { mode } = Route.useSearch()
  const { data: trainer, isLoading } = useGetStaffById(Number(trainerId))

  if (!trainer) {
    return null
  }

  return <TrainerProfileSection trainer={trainer} isLoading={isLoading} readOnly={mode === 'view'} />
}

export const Route = createFileRoute('/_authenticated/staff/trainers/$trainerId/')({
  component: TrainerProfileRoute,
})
