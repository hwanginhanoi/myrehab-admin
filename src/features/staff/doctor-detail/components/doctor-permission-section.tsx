import type { StaffResponse } from '@/api'
import { DoctorContentSection } from './doctor-content-section'
import { DoctorPermissionForm } from './doctor-permission-form'

type DoctorPermissionSectionProps = {
  doctor: StaffResponse
}

export function DoctorPermissionSection({
  doctor,
}: DoctorPermissionSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Quyền'
      desc='Quản lý quyền truy cập và thao tác của bác sĩ trong hệ thống.'
      fullWidth
    >
      <DoctorPermissionForm doctor={doctor} />
    </DoctorContentSection>
  )
}
