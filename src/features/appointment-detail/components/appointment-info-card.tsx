import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppointmentResponse } from '@/api'
import { formatLocalTime, formatCurrency } from '@/lib/appointment-utils'
import { AppointmentStatusBadge } from '@/features/appointments/components/appointment-status-badge'

type AppointmentInfoCardProps = {
  appointment: AppointmentResponse
}

export function AppointmentInfoCard({ appointment }: AppointmentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin lịch hẹn #{appointment.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <InfoItem label='Trạng thái'>
            <AppointmentStatusBadge status={appointment.status} />
          </InfoItem>
          <InfoItem label='Bệnh nhân'>{appointment.userName || '-'}</InfoItem>
          <InfoItem label='Bác sĩ'>{appointment.doctorName || 'Chưa phân công'}</InfoItem>
          <InfoItem label='Ngày hẹn'>{appointment.appointmentDate || '-'}</InfoItem>
          <InfoItem label='Thời gian'>
            {formatLocalTime(appointment.startTime)} - {formatLocalTime(appointment.endTime)}
          </InfoItem>
          <InfoItem label='Phí khám'>{formatCurrency(appointment.fee)}</InfoItem>
          {appointment.patientNotes && (
            <InfoItem label='Ghi chú bệnh nhân' className='sm:col-span-2 lg:col-span-3'>
              {appointment.patientNotes}
            </InfoItem>
          )}
          {appointment.doctorNotes && (
            <InfoItem label='Ghi chú bác sĩ' className='sm:col-span-2 lg:col-span-3'>
              {appointment.doctorNotes}
            </InfoItem>
          )}
          {appointment.adminNotes && (
            <InfoItem label='Ghi chú admin' className='sm:col-span-2 lg:col-span-3'>
              {appointment.adminNotes}
            </InfoItem>
          )}
          {appointment.rejectionReason && (
            <InfoItem label='Lý do từ chối' className='sm:col-span-2 lg:col-span-3'>
              {appointment.rejectionReason}
            </InfoItem>
          )}
          {appointment.cancellationReason && (
            <InfoItem label='Lý do hủy' className='sm:col-span-2 lg:col-span-3'>
              {appointment.cancellationReason}
            </InfoItem>
          )}
          {appointment.confirmedByStaffName && (
            <InfoItem label='Xác nhận bởi'>{appointment.confirmedByStaffName}</InfoItem>
          )}
          {appointment.disputeNotes && (
            <InfoItem label='Ghi chú tranh chấp' className='sm:col-span-2 lg:col-span-3'>
              {appointment.disputeNotes}
            </InfoItem>
          )}
          {appointment.resolvedByAdminName && (
            <InfoItem label='Giải quyết bởi'>{appointment.resolvedByAdminName}</InfoItem>
          )}
          {appointment.disputeResolutionNotes && (
            <InfoItem label='Ghi chú giải quyết' className='sm:col-span-2 lg:col-span-3'>
              {appointment.disputeResolutionNotes}
            </InfoItem>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <dt className='text-muted-foreground text-sm'>{label}</dt>
      <dd className='mt-1 text-sm font-medium'>{children}</dd>
    </div>
  )
}
