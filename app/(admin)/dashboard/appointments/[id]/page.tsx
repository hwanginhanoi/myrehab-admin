'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getAppointmentById } from '@/api/api/appointmentController';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { AppointmentTypeBadge } from '@/components/appointments/appointment-type-badge';
import { ApproveAppointmentDialog } from '@/components/appointments/dialogs/approve-appointment-dialog';
import { RejectAppointmentDialog } from '@/components/appointments/dialogs/reject-appointment-dialog';
import { AssignDoctorDialog } from '@/components/appointments/dialogs/assign-doctor-dialog';
import { CompleteAppointmentDialog } from '@/components/appointments/dialogs/complete-appointment-dialog';
import { JoinVideoCallButton } from '@/components/appointments/join-video-call-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  UserPlus,
} from 'lucide-react';
import { formatAppointmentDateTime, formatDuration } from '@/lib/utils/datetime';
import type { AppointmentStatus, AppointmentType } from '@/types/appointments';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = parseInt(params.id as string);

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: !!appointmentId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="m-9 mt-9 mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Không tìm thấy lịch hẹn'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const status = appointment.status as AppointmentStatus;
  const type = appointment.type as AppointmentType;

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold text-[#EF7F26]">Chi tiết lịch hẹn</h1>
            </div>
            <p className="text-base text-[#71717A] ml-11">Mã lịch hẹn: #{appointmentId}</p>
          </div>
          <div className="flex gap-2">
            <AppointmentStatusBadge status={status} />
            <AppointmentTypeBadge type={type} />
          </div>
        </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointment Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Thông tin lịch hẹn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Ngày giờ</p>
              <p className="text-lg font-semibold">
                {formatAppointmentDateTime(appointment.appointmentDateTime!)}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Thời lượng</p>
              <p className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatDuration(appointment.durationMinutes || 60)}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Loại hình</p>
              <div className="mt-1">
                <AppointmentTypeBadge type={type} />
              </div>
            </div>
            {type === 'ONLINE' && appointment.agoraChannelName && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Kênh video</p>
                  <p className="font-mono text-sm">{appointment.agoraChannelName}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Patient Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin bệnh nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.user ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Họ và tên</p>
                  <p className="font-semibold">{appointment.user.fullName || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{appointment.user.email || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{appointment.user.phoneNumber || 'N/A'}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Không có thông tin bệnh nhân</p>
            )}
          </CardContent>
        </Card>

        {/* Doctor Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin bác sĩ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.doctor ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Họ và tên</p>
                  <p className="font-semibold">{appointment.doctor.fullName || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{appointment.doctor.email || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{appointment.doctor.phoneNumber || 'N/A'}</p>
                </div>
                {appointment.assignedByAdmin && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Được giao bởi</p>
                      <p className="font-medium">{appointment.assignedByAdmin.fullName || 'N/A'}</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Chưa có bác sĩ được giao</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ghi chú
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.userNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ghi chú của bệnh nhân</p>
                <p className="text-sm bg-muted p-3 rounded-md">{appointment.userNotes}</p>
              </div>
            )}
            {appointment.adminNotes && (
              <>
                {appointment.userNotes && <Separator />}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ghi chú nội bộ</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{appointment.adminNotes}</p>
                </div>
              </>
            )}
            {appointment.rejectionReason && (
              <>
                {(appointment.userNotes || appointment.adminNotes) && <Separator />}
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">Lý do từ chối</p>
                  <p className="text-sm bg-destructive/10 p-3 rounded-md text-destructive">
                    {appointment.rejectionReason}
                  </p>
                </div>
              </>
            )}
            {!appointment.userNotes && !appointment.adminNotes && !appointment.rejectionReason && (
              <p className="text-center text-muted-foreground py-4">Không có ghi chú</p>
            )}
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lịch sử</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointment.createdAt && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">
                    {format(new Date(appointment.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Lịch hẹn được tạo</p>
                    <p className="text-sm text-muted-foreground">Bệnh nhân đã đặt lịch hẹn</p>
                  </div>
                </div>
              )}
              {appointment.updatedAt && appointment.updatedAt !== appointment.createdAt && (
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">
                    {format(new Date(appointment.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Cập nhật lần cuối</p>
                    <p className="text-sm text-muted-foreground">Trạng thái: {status}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-end gap-2 flex-wrap">
            {status === 'PENDING' && (
              <>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setApproveDialogOpen(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Duyệt
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </Button>
                {!appointment.doctor && (
                  <Button
                    variant="outline"
                    onClick={() => setAssignDialogOpen(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Giao bác sĩ
                  </Button>
                )}
              </>
            )}
            {status === 'APPROVED' && (
              <>
                <Button
                  variant="default"
                  onClick={() => setCompleteDialogOpen(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Hoàn thành
                </Button>
                {type === 'ONLINE' && <JoinVideoCallButton appointment={appointment} />}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ApproveAppointmentDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        appointmentId={appointmentId}
        patientName={appointment.user?.fullName}
      />
      <RejectAppointmentDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        appointmentId={appointmentId}
        patientName={appointment.user?.fullName}
      />
      <AssignDoctorDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        appointmentId={appointmentId}
        appointmentType={type}
        appointmentDateTime={appointment.appointmentDateTime!}
        patientName={appointment.user?.fullName}
      />
      <CompleteAppointmentDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        appointmentId={appointmentId}
        patientName={appointment.user?.fullName}
      />
      </div>
    </div>
  );
}
