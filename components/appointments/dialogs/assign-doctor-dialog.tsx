'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppointmentActions } from '@/lib/hooks/use-appointment-actions';
import { getAllDoctors } from '@/api/api/doctorManagementControllerController';
import { getAvailableSlots } from '@/api/api/doctorScheduleController';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import type { AppointmentType } from '@/types/appointments';

interface AssignDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  appointmentType: AppointmentType;
  appointmentDateTime: string;
  patientName?: string;
}

export function AssignDoctorDialog({
  open,
  onOpenChange,
  appointmentId,
  appointmentType,
  appointmentDateTime,
  patientName,
}: AssignDoctorDialogProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { assign } = useAppointmentActions();

  // Fetch all doctors
  const { data: doctorsResponse, isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      return await getAllDoctors({
        pageable: {
          page: 0,
          size: 100,
          sort: ['fullName,asc'],
        },
      });
    },
  });

  const doctors = doctorsResponse?.content || [];

  // Check doctor availability for ONLINE appointments
  const { data: availableSlots, isLoading: checkingAvailability } = useQuery({
    queryKey: ['doctor-availability', selectedDoctorId, appointmentDateTime],
    queryFn: async () => {
      const appointmentDate = new Date(appointmentDateTime);
      return await getAvailableSlots(parseInt(selectedDoctorId), {
        date: format(appointmentDate, 'yyyy-MM-dd'),
      });
    },
    enabled: !!selectedDoctorId && appointmentType === 'ONLINE',
  });

  // Check if selected time slot is available
  useEffect(() => {
    if (appointmentType === 'IN_PERSON') {
      setIsAvailable(true);
      return;
    }

    if (!selectedDoctorId || !availableSlots) {
      setIsAvailable(null);
      return;
    }

    const appointmentTime = format(new Date(appointmentDateTime), 'HH:mm');
    const available = availableSlots.availableSlots?.some(
      (slot) => slot.startsWith(appointmentTime)
    );
    setIsAvailable(available || false);
  }, [selectedDoctorId, availableSlots, appointmentDateTime, appointmentType]);

  const handleAssign = () => {
    if (!selectedDoctorId) return;

    if (appointmentType === 'ONLINE' && !isAvailable) {
      return;
    }

    assign.mutate(
      { id: appointmentId, doctorId: parseInt(selectedDoctorId) },
      {
        onSuccess: () => {
          setSelectedDoctorId('');
          setIsAvailable(null);
          onOpenChange(false);
        },
      }
    );
  };

  const canAssign = selectedDoctorId && (appointmentType === 'IN_PERSON' || isAvailable === true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Giao bác sĩ cho lịch hẹn</DialogTitle>
          <DialogDescription>
            Chọn bác sĩ cho lịch hẹn{patientName ? ` của ${patientName}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Bác sĩ <span className="text-red-500">*</span></Label>
            {loadingDoctors ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Chọn bác sĩ..." />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={String(doctor.id)}>
                      {doctor.fullName} - {doctor.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Availability Check for ONLINE appointments */}
          {appointmentType === 'ONLINE' && selectedDoctorId && (
            <div>
              {checkingAvailability ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Skeleton className="h-4 w-4" />
                  <span>Đang kiểm tra lịch làm việc...</span>
                </div>
              ) : isAvailable === true ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Bác sĩ có lịch làm việc tại khung giờ này
                  </AlertDescription>
                </Alert>
              ) : isAvailable === false ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Bác sĩ không có lịch làm việc tại khung giờ này
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDoctorId('');
              setIsAvailable(null);
              onOpenChange(false);
            }}
            disabled={assign.isPending}
          >
            Hủy
          </Button>
          <Button onClick={handleAssign} disabled={!canAssign || assign.isPending}>
            {assign.isPending ? 'Đang giao...' : 'Giao bác sĩ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
