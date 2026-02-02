import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { AdminPermissionSection } from '@/features/staff/admin-detail/components/admin-permission-section'

const parentRoute = getRouteApi('/_authenticated/staff/admins/$adminId')

function AdminPermissionsRoute() {
  const { adminId } = Route.useParams()
  const { mode } = parentRoute.useSearch()

  const { data: admin, isLoading, error } = useGetStaffById(Number(adminId))

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <p className='text-muted-foreground'>Đang tải...</p>
      </div>
    )
  }

  if (error || !admin) {
    return (
      <div className='flex items-center justify-center h-32'>
        <p className='text-destructive'>Không thể tải thông tin quản trị viên</p>
      </div>
    )
  }

  return <AdminPermissionSection admin={admin} readOnly={mode === 'view'} />
}

export const Route = createFileRoute(
  '/_authenticated/staff/admins/$adminId/permissions'
)({
  component: AdminPermissionsRoute,
})
