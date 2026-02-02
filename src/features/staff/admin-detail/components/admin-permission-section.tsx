import type { StaffResponse } from '@/api'
import { AdminContentSection } from './admin-content-section'
import { StaffPermissionForm } from '../../components/staff-permission-form'

type AdminPermissionSectionProps = {
  admin: StaffResponse
  readOnly?: boolean
}

export function AdminPermissionSection({
  admin,
  readOnly,
}: AdminPermissionSectionProps) {
  return (
    <AdminContentSection
      title='Quản lý Quyền'
      desc={readOnly ? 'Xem quyền truy cập và thao tác của quản trị viên trong hệ thống.' : 'Quản lý quyền truy cập và thao tác của quản trị viên trong hệ thống.'}
      fullWidth
    >
      <StaffPermissionForm staff={admin} readOnly={readOnly} />
    </AdminContentSection>
  )
}
