import type { AppointmentResponse } from '@/api'
import { AppointmentSlotCard } from './appointment-slot-card'

type DailyScheduleViewProps = {
  appointments: AppointmentResponse[]
}

export function DailyScheduleView({ appointments }: DailyScheduleViewProps) {
  const sorted = [...appointments].sort((a, b) => {
    const aTime = (a.startTime?.hour ?? 0) * 60 + (a.startTime?.minute ?? 0)
    const bTime = (b.startTime?.hour ?? 0) * 60 + (b.startTime?.minute ?? 0)
    return aTime - bTime
  })

  if (sorted.length === 0) {
    return (
      <div className='flex items-center justify-center h-48 rounded-md border border-dashed'>
        <p className='text-muted-foreground'>Không có lịch hẹn nào trong ngày này.</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {sorted.map((appointment) => (
        <AppointmentSlotCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  )
}
