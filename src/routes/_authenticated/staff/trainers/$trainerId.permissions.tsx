import { createFileRoute } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { TrainerPermissionSection } from '@/features/staff/trainer-detail/components/trainer-permission-section'

function TrainerPermissionsRoute() {
  const { trainerId } = Route.useParams()

  const { data: trainer, isLoading, error } = useGetStaffById(Number(trainerId))

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <p className='text-muted-foreground'>Đang tải...</p>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className='flex items-center justify-center h-32'>
        <p className='text-destructive'>Không thể tải thông tin huấn luyện viên</p>
      </div>
    )
  }

  return <TrainerPermissionSection trainer={trainer} />
}

export const Route = createFileRoute(
  '/_authenticated/staff/trainers/$trainerId/permissions'
)({
  component: TrainerPermissionsRoute,
})
