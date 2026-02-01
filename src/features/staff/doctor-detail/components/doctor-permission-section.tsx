import type { StaffResponse } from '@/api'
import { DoctorContentSection } from './doctor-content-section'
import { DoctorPermissionForm } from './doctor-permission-form'

type DoctorPermissionSectionProps = {
  doctor: StaffResponse
  readOnly?: boolean
}

export function DoctorPermissionSection({
  doctor,
  readOnly,
}: DoctorPermissionSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Quyền'
      desc={readOnly ? 'Xem quyền truy cập và thao tác của bác sĩ trong hệ thống.' : 'Quản lý quyền truy cập và thao tác của bác sĩ trong hệ thống.'}
      fullWidth
    >
      <DoctorPermissionForm doctor={doctor} readOnly={readOnly} />
    </DoctorContentSection>
  )
}
