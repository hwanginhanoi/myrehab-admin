import type { StaffResponse } from '@/api'
import { TrainerContentSection } from './trainer-content-section'
import { StaffPermissionForm } from '../../components/staff-permission-form'

type TrainerPermissionSectionProps = {
  trainer: StaffResponse
  readOnly?: boolean
}

export function TrainerPermissionSection({
  trainer,
  readOnly,
}: TrainerPermissionSectionProps) {
  return (
    <TrainerContentSection
      title='Quản lý Quyền'
      desc={readOnly ? 'Xem quyền truy cập và thao tác của huấn luyện viên trong hệ thống.' : 'Quản lý quyền truy cập và thao tác của huấn luyện viên trong hệ thống.'}
      fullWidth
    >
      <StaffPermissionForm staff={trainer} readOnly={readOnly} />
    </TrainerContentSection>
  )
}
