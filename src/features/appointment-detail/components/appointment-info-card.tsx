import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Trạng thái">
            <AppointmentStatusBadge status={appointment.status} />
          </InfoItem>
          <InfoItem label="Bệnh nhân">{appointment.userName || '-'}</InfoItem>
          <InfoItem label="Bác sĩ">
            {appointment.doctorName || 'Chưa phân công'}
          </InfoItem>
          <InfoItem label="Ngày hẹn">
            {appointment.appointmentDate || '-'}
          </InfoItem>
          <InfoItem label="Thời gian">
            {formatLocalTime(appointment.startTime)} -{' '}
            {formatLocalTime(appointment.endTime)}
          </InfoItem>
          <InfoItem label="Phí khám">
            {formatCurrency(appointment.fee)}
          </InfoItem>
          {appointment.patientNotes && (
            <InfoItem
              label="Ghi chú bệnh nhân"
              className="sm:col-span-2 lg:col-span-3"
            >
              {appointment.patientNotes}
            </InfoItem>
          )}
          {appointment.doctorNotes && (
            <InfoItem
              label="Ghi chú bác sĩ"
              className="sm:col-span-2 lg:col-span-3"
            >
              {appointment.doctorNotes}
            </InfoItem>
          )}
          {appointment.adminNotes && (
            <InfoItem
              label="Ghi chú admin"
              className="sm:col-span-2 lg:col-span-3"
            >
              {appointment.adminNotes}
            </InfoItem>
          )}
          {appointment.rejectionReason && (
            <InfoItem
              label="Lý do từ chối"
              className="sm:col-span-2 lg:col-span-3"
            >
              {appointment.rejectionReason}
            </InfoItem>
          )}
          {appointment.cancellationReason && (
            <InfoItem label="Lý do hủy" className="sm:col-span-2 lg:col-span-3">
              {appointment.cancellationReason}
            </InfoItem>
          )}
          {appointment.sttLanguage && (
            <InfoItem label="Ngôn ngữ">
              {appointment.sttLanguage === 'EN_US' ? (
                <Badge variant="secondary">🌐 Tiếng Anh (Dịch thuật)</Badge>
              ) : (
                'Tiếng Việt'
              )}
            </InfoItem>
          )}
          {appointment.confirmedByStaffName && (
            <InfoItem label="Xác nhận bởi">
              {appointment.confirmedByStaffName}
            </InfoItem>
          )}
          {appointment.disputeNotes && (
            <InfoItem
              label="Ghi chú tranh chấp"
              className="sm:col-span-2 lg:col-span-3"
            >
              {appointment.disputeNotes}
            </InfoItem>
          )}
          {appointment.resolvedByAdminName && (
            <InfoItem label="Giải quyết bởi">
              {appointment.resolvedByAdminName}
            </InfoItem>
          )}
          {appointment.disputeResolutionNotes && (
            <InfoItem
              label="Ghi chú giải quyết"
              className="sm:col-span-2 lg:col-span-3"
            >
              {appointment.disputeResolutionNotes}
            </InfoItem>
          )}
        </dl>

        {(appointment.pastResultImageKeys?.length || appointment.patientTarget || appointment.existingProblems) ? (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Thông tin khám ban đầu</h4>
            {appointment.pastResultImageKeys && appointment.pastResultImageKeys.length > 0 && (
              <div className="mb-3">
                <p className="text-muted-foreground text-sm mb-2">Hình ảnh kết quả trước đây</p>
                <div className="flex flex-wrap gap-2">
                  {appointment.pastResultImageKeys.map((key, idx) => (
                    <a key={idx} href={key} target="_blank" rel="noopener noreferrer">
                      <img
                        src={key}
                        alt={`Kết quả ${idx + 1}`}
                        className="h-20 w-20 rounded-md object-cover border"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {appointment.patientTarget && (
              <div className="mb-2">
                <p className="text-muted-foreground text-sm">Mục tiêu</p>
                <p className="text-sm font-medium mt-1">{appointment.patientTarget}</p>
              </div>
            )}
            {appointment.existingProblems && (
              <div>
                <p className="text-muted-foreground text-sm">Vấn đề hiện tại</p>
                <p className="text-sm font-medium mt-1">{appointment.existingProblems}</p>
              </div>
            )}
          </div>
        ) : null}
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
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{children}</dd>
    </div>
  )
}
