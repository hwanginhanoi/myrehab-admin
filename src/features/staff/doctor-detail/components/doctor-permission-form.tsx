import type { StaffResponse } from '@/api'
import { StaffPermissionForm } from '../../components/staff-permission-form'

type DoctorPermissionFormProps = {
  doctor: StaffResponse
  readOnly?: boolean
}

export function DoctorPermissionForm({ doctor, readOnly }: DoctorPermissionFormProps) {
  return <StaffPermissionForm staff={doctor} readOnly={readOnly} />
}
