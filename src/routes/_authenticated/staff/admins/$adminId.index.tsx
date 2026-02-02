import { createFileRoute } from '@tanstack/react-router'
import { useGetStaffById } from '@/api'
import { AdminProfileSection } from '@/features/staff/admin-detail/components/admin-profile-section'

function AdminProfileRoute() {
  const { adminId } = Route.useParams()
  const { mode } = Route.useSearch()
  const { data: admin, isLoading } = useGetStaffById(Number(adminId))

  if (!admin) {
    return null
  }

  return <AdminProfileSection admin={admin} isLoading={isLoading} readOnly={mode === 'view'} />
}

export const Route = createFileRoute('/_authenticated/staff/admins/$adminId/')({
  component: AdminProfileRoute,
})
