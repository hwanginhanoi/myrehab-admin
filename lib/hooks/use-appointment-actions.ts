import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  assignDoctor,
  cancelAppointment,
} from '@/api/api/appointmentController';
import { toast } from 'sonner';

interface ApproveInput {
  id: number;
  notes?: string;
}

interface RejectInput {
  id: number;
  rejectionReason: string;
}

interface CompleteInput {
  id: number;
  // Note: Complete appointment API doesn't accept notes in current backend implementation
}

interface AssignInput {
  id: number;
  doctorId: number;
}

export function useAppointmentActions() {
  const queryClient = useQueryClient();

  const approve = useMutation({
    mutationFn: async ({ id, notes }: ApproveInput) => {
      const requestData = notes ? { notes } : {};
      return await approveAppointment(id, requestData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
      toast.success('Đã duyệt lịch hẹn');
    },
    onError: (error: Error) => {
      toast.error('Không thể duyệt lịch hẹn', {
        description: error.message,
      });
    },
  });

  const reject = useMutation({
    mutationFn: async ({ id, rejectionReason }: RejectInput) => {
      return await rejectAppointment(id, { rejectionReason });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
      toast.success('Đã từ chối lịch hẹn');
    },
    onError: (error: Error) => {
      toast.error('Không thể từ chối lịch hẹn', {
        description: error.message,
      });
    },
  });

  const complete = useMutation({
    mutationFn: async ({ id }: CompleteInput) => {
      // Note: Current backend implementation doesn't accept notes for complete endpoint
      return await completeAppointment(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
      toast.success('Đã hoàn thành lịch hẹn');
    },
    onError: (error: Error) => {
      toast.error('Không thể hoàn thành lịch hẹn', {
        description: error.message,
      });
    },
  });

  const assign = useMutation({
    mutationFn: async ({ id, doctorId }: AssignInput) => {
      return await assignDoctor(id, { doctorId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
      toast.success('Đã giao bác sĩ');
    },
    onError: (error: Error) => {
      toast.error('Không thể giao bác sĩ', {
        description: error.message,
      });
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: number) => {
      return await cancelAppointment(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      toast.success('Đã hủy lịch hẹn');
    },
    onError: (error: Error) => {
      toast.error('Không thể hủy lịch hẹn', {
        description: error.message,
      });
    },
  });

  return {
    approve,
    reject,
    complete,
    assign,
    cancel,
  };
}
