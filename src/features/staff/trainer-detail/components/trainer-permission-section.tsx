import type { StaffResponse } from '@/api'
import { TrainerContentSection } from './trainer-content-section'
import { StaffPermissionForm } from '../../components/staff-permission-form'

type TrainerPermissionSectionProps = {
  trainer: StaffResponse
}

export function TrainerPermissionSection({
  trainer,
}: TrainerPermissionSectionProps) {
  return (
    <TrainerContentSection
      title='Quản lý Quyền'
      desc='Quản lý quyền truy cập và thao tác của huấn luyện viên trong hệ thống.'
      fullWidth
    >
      <StaffPermissionForm staff={trainer} />
    </TrainerContentSection>
  )
}
