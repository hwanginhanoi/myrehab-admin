import { Stethoscope, Dumbbell, UserCog, Shield } from 'lucide-react'

export const staffRoles = [
  { label: 'Bác sĩ', value: 'DOCTOR', icon: Stethoscope },
  { label: 'Huấn luyện viên', value: 'TRAINER', icon: Dumbbell },
  { label: 'Quản trị viên', value: 'ADMIN', icon: UserCog },
  { label: 'Quản trị viên cấp cao', value: 'SUPER_ADMIN', icon: Shield },
]

export const staffStatuses = [
  { label: 'Hoạt động', value: 'active' },
  { label: 'Vô hiệu hóa', value: 'inactive' },
]

export const statusColors = new Map<'active' | 'inactive', string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export function getStaffTypeLabel(type: string): string {
  const role = staffRoles.find((r) => r.value === type)
  return role?.label || type
}

export function getStaffStatusLabel(enabled: boolean): string {
  return enabled ? 'Hoạt động' : 'Vô hiệu hóa'
}
