import type { StaffResponse } from '@/api'
import { StaffPermissionForm } from '../../components/staff-permission-form'

type DoctorPermissionFormProps = {
  doctor: StaffResponse
}

export function DoctorPermissionForm({ doctor }: DoctorPermissionFormProps) {
  return <StaffPermissionForm staff={doctor} />
}
