import type { LocalTime } from '@/api'

export function formatLocalTime(time?: LocalTime): string {
  if (!time) return '--:--'
  const h = String(time.hour ?? 0).padStart(2, '0')
  const m = String(time.minute ?? 0).padStart(2, '0')
  return `${h}:${m}`
}

export function parseTimeString(timeStr: string): LocalTime {
  const [h, m] = timeStr.split(':').map(Number)
  return { hour: h, minute: m, second: 0, nano: 0 }
}

export function formatCurrency(value?: number): string {
  if (value == null) return '0 VND'
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND'
}

export const appointmentStatusConfig = {
  PENDING_CONFIRMATION: {
    label: 'Chờ xác nhận',
    variant: 'secondary' as const,
    color: 'bg-yellow-500',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    variant: 'default' as const,
    color: 'bg-blue-500',
  },
  DOCTOR_COMPLETED: {
    label: 'Bác sĩ hoàn thành',
    variant: 'outline' as const,
    color: 'bg-indigo-500',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    variant: 'default' as const,
    color: 'bg-green-500',
  },
  CANCELLED: {
    label: 'Đã hủy',
    variant: 'destructive' as const,
    color: 'bg-gray-500',
  },
  REJECTED: {
    label: 'Từ chối',
    variant: 'destructive' as const,
    color: 'bg-red-500',
  },
  DISPUTED: {
    label: 'Tranh chấp',
    variant: 'destructive' as const,
    color: 'bg-orange-500',
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    variant: 'outline' as const,
    color: 'bg-gray-400',
  },
} as const

export type AppointmentStatus = keyof typeof appointmentStatusConfig

export const appointmentStatusOptions = Object.entries(appointmentStatusConfig).map(
  ([value, config]) => ({
    label: config.label,
    value,
  })
)

export type AppointmentAction =
  | 'assign_doctor'
  | 'confirm'
  | 'reject'
  | 'confirm_completion'
  | 'resolve_dispute'
  | 'join_video_call'

export function getAvailableActions(status?: string): AppointmentAction[] {
  switch (status) {
    case 'PENDING_CONFIRMATION':
      return ['assign_doctor', 'confirm', 'reject']
    case 'CONFIRMED':
      return ['join_video_call']
    case 'DOCTOR_COMPLETED':
      return ['confirm_completion']
    case 'DISPUTED':
      return ['resolve_dispute']
    default:
      return []
  }
}

export const dayOfWeekLabels: Record<string, string> = {
  MONDAY: 'Thứ Hai',
  TUESDAY: 'Thứ Ba',
  WEDNESDAY: 'Thứ Tư',
  THURSDAY: 'Thứ Năm',
  FRIDAY: 'Thứ Sáu',
  SATURDAY: 'Thứ Bảy',
  SUNDAY: 'Chủ Nhật',
}
