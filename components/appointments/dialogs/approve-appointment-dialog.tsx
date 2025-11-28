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

interface ApproveAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  patientName?: string;
}

export function ApproveAppointmentDialog({
  open,
  onOpenChange,
  appointmentId,
  patientName,
}: ApproveAppointmentDialogProps) {
  const [notes, setNotes] = useState('');
  const { approve } = useAppointmentActions();

  const handleApprove = () => {
    approve.mutate(
      { id: appointmentId, notes: notes || undefined },
      {
        onSuccess: () => {
          setNotes('');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận duyệt lịch hẹn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn duyệt lịch hẹn{patientName ? ` của ${patientName}` : ' này'}?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú nội bộ (tùy chọn)</Label>
          <Textarea
            id="notes"
            placeholder="Thêm ghi chú nội bộ..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={approve.isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleApprove();
            }}
            disabled={approve.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {approve.isPending ? 'Đang duyệt...' : 'Duyệt'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
