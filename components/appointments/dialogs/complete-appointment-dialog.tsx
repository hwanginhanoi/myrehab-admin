'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppointmentActions } from '@/lib/hooks/use-appointment-actions';

interface CompleteAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  patientName?: string;
}

export function CompleteAppointmentDialog({
  open,
  onOpenChange,
  appointmentId,
  patientName,
}: CompleteAppointmentDialogProps) {
  const { complete } = useAppointmentActions();

  const handleComplete = () => {
    complete.mutate(
      { id: appointmentId },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hoàn thành lịch hẹn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn đánh dấu lịch hẹn{patientName ? ` của ${patientName}` : ' này'} là đã hoàn thành?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={complete.isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleComplete();
            }}
            disabled={complete.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {complete.isPending ? 'Đang hoàn thành...' : 'Hoàn thành'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
