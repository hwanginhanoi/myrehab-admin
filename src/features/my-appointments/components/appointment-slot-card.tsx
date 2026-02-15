import { Card, CardContent } from '@/components/ui/card'
import type { AppointmentResponse } from '@/api'
import { formatLocalTime } from '@/lib/appointment-utils'
import { AppointmentStatusBadge } from '@/features/appointments/components/appointment-status-badge'
import { DoctorAppointmentActions } from './doctor-appointment-actions'

type AppointmentSlotCardProps = {
  appointment: AppointmentResponse
}

export function AppointmentSlotCard({ appointment }: AppointmentSlotCardProps) {
  return (
    <Card>
      <CardContent className='flex items-center justify-between gap-4 p-4'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>
              {formatLocalTime(appointment.startTime)} - {formatLocalTime(appointment.endTime)}
            </span>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          <p className='text-sm'>
            Bệnh nhân: <span className='font-medium'>{appointment.userName || '-'}</span>
          </p>
          {appointment.patientNotes && (
            <p className='text-muted-foreground text-xs'>{appointment.patientNotes}</p>
          )}
        </div>
        <DoctorAppointmentActions appointment={appointment} />
      </CardContent>
    </Card>
  )
}
