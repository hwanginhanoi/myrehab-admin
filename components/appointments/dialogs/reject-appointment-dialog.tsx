'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAppointmentActions } from '@/lib/hooks/use-appointment-actions';

interface RejectAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  patientName?: string;
}

export function RejectAppointmentDialog({
  open,
  onOpenChange,
  appointmentId,
  patientName,
}: RejectAppointmentDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');
  const { reject } = useAppointmentActions();

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }

    reject.mutate(
      { id: appointmentId, rejectionReason },
      {
        onSuccess: () => {
          setRejectionReason('');
          setError('');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận từ chối lịch hẹn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn từ chối lịch hẹn{patientName ? ` của ${patientName}` : ' này'}?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejectionReason">
            Lý do từ chối <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="rejectionReason"
            placeholder="Nhập lý do từ chối..."
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value);
              setError('');
            }}
            rows={3}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={reject.isPending}
            onClick={() => {
              setRejectionReason('');
              setError('');
            }}
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleReject();
            }}
            disabled={reject.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {reject.isPending ? 'Đang từ chối...' : 'Từ chối'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
