import type { StaffResponse } from '@/api'
import { AdminContentSection } from './admin-content-section'
import { StaffPermissionForm } from '../../components/staff-permission-form'

type AdminPermissionSectionProps = {
  admin: StaffResponse
}

export function AdminPermissionSection({
  admin,
}: AdminPermissionSectionProps) {
  return (
    <AdminContentSection
      title='Quản lý Quyền'
      desc='Quản lý quyền truy cập và thao tác của quản trị viên trong hệ thống.'
      fullWidth
    >
      <StaffPermissionForm staff={admin} />
    </AdminContentSection>
  )
}
