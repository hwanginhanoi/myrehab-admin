import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppointmentResponse } from '@/api'

type AppointmentTimelineProps = {
  appointment: AppointmentResponse
}

type TimelineEvent = {
  label: string
  timestamp?: string
}

export function AppointmentTimeline({ appointment }: AppointmentTimelineProps) {
  const events: TimelineEvent[] = [
    { label: 'Tạo lịch hẹn', timestamp: appointment.createdAt },
    { label: 'Xác nhận', timestamp: appointment.confirmedAt },
    { label: 'Bác sĩ hoàn thành', timestamp: appointment.doctorCompletedAt },
    { label: 'Bệnh nhân xác nhận', timestamp: appointment.patientConfirmedAt },
    { label: 'Tranh chấp', timestamp: appointment.disputedAt },
    { label: 'Giải quyết', timestamp: appointment.resolvedAt },
  ].filter((e) => e.timestamp)

  if (events.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dòng thời gian</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className='relative border-s border-gray-200 dark:border-gray-700'>
          {events.map((event, index) => (
            <li key={index} className='mb-6 ms-4 last:mb-0'>
              <div className='bg-primary absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white dark:border-gray-900' />
              <time className='text-muted-foreground mb-1 text-xs font-normal leading-none'>
                {formatDateTime(event.timestamp!)}
              </time>
              <p className='text-sm font-medium'>{event.label}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
