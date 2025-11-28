'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { getAgoraToken } from '@/api/api/appointmentController';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Video, Loader2, Clock, AlertCircle } from 'lucide-react';
import {
  canJoinVideoCall,
  formatTimeRemaining,
  getTimeUntilStart,
  isAppointmentActive,
} from '@/lib/utils/agora';
import type { AppointmentResponse } from '@/api/types/AppointmentResponse';

interface JoinVideoCallButtonProps {
  appointment: AppointmentResponse;
}

export function JoinVideoCallButton({ appointment }: JoinVideoCallButtonProps) {
  const router = useRouter();
  const [timeUntilStart, setTimeUntilStart] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    mutate: fetchToken,
    isPending,
  } = useMutation({
    mutationFn: () => getAgoraToken(appointment.id!),
    onSuccess: (data) => {
      setErrorMessage(null);
      // Navigate to video call page with token and appointment data
      const params = new URLSearchParams({
        appointmentId: appointment.id!.toString(),
        channel: data.channelName || '',
        token: data.token || '',
        appId: data.appId || '',
        uid: data.uid?.toString() || '',
        patientName: appointment.user?.fullName || 'Bệnh nhân',
        endTime: data.appointment?.calculatedEndTime || appointment.appointmentDateTime || '',
        duration: (appointment.durationMinutes || 60).toString(),
      });
      router.push(`/dashboard/video-call?${params.toString()}`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err?.response?.data?.message || err?.message || 'Unknown error';
      setErrorMessage(message);
    },
  });

  // Update countdown timer
  useEffect(() => {
    if (!appointment.appointmentDateTime) return;

    const updateTimer = () => {
      const remaining = getTimeUntilStart(appointment.appointmentDateTime!);
      setTimeUntilStart(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [appointment.appointmentDateTime]);

  const { canJoin, reason } = canJoinVideoCall(
    appointment.type || '',
    appointment.status || '',
    appointment.appointmentDateTime || '',
    appointment.durationMinutes || 60
  );

  // Don't show button if appointment type is not ONLINE
  if (appointment.type !== 'ONLINE') {
    return null;
  }

  const handleJoinClick = () => {
    if (canJoin) {
      fetchToken();
    }
  };

  // Get button text and state
  const getButtonState = () => {
    if (isPending) {
      return {
        text: 'Đang kết nối...',
        disabled: true,
        icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
      };
    }

    if (reason === 'APPOINTMENT_NOT_APPROVED') {
      return {
        text: 'Chưa được duyệt',
        disabled: true,
        icon: <AlertCircle className="mr-2 h-4 w-4" />,
      };
    }

    if (reason === 'APPOINTMENT_NOT_STARTED') {
      return {
        text: `Bắt đầu sau ${formatTimeRemaining(timeUntilStart, 'vi')}`,
        disabled: true,
        icon: <Clock className="mr-2 h-4 w-4" />,
      };
    }

    if (reason === 'APPOINTMENT_ENDED') {
      return {
        text: 'Cuộc hẹn đã kết thúc',
        disabled: true,
        icon: <AlertCircle className="mr-2 h-4 w-4" />,
      };
    }

    return {
      text: 'Tham gia cuộc gọi video',
      disabled: false,
      icon: <Video className="mr-2 h-4 w-4" />,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={handleJoinClick}
        disabled={buttonState.disabled}
        className="w-full sm:w-auto"
      >
        {buttonState.icon}
        {buttonState.text}
      </Button>

      {/* Error message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi kết nối</AlertTitle>
          <AlertDescription>{getErrorMessage(errorMessage)}</AlertDescription>
        </Alert>
      )}

      {/* Countdown for active appointments */}
      {canJoin && isAppointmentActive(
        appointment.appointmentDateTime || '',
        appointment.durationMinutes || 60
      ) && (
        <p className="text-sm text-muted-foreground">
          Cuộc hẹn đang diễn ra
        </p>
      )}

    </div>
  );
}

function getErrorMessage(message: string): string {
  if (message.includes('not started yet')) {
    return 'Cuộc hẹn chưa bắt đầu. Vui lòng quay lại vào giờ hẹn.';
  }
  if (message.includes('already ended')) {
    return 'Cuộc hẹn đã kết thúc. Không thể tham gia cuộc gọi video.';
  }
  if (message.includes('Only ONLINE appointments')) {
    return 'Chỉ có cuộc hẹn trực tuyến mới hỗ trợ gọi video.';
  }
  if (message.includes('Only APPROVED appointments')) {
    return 'Cuộc hẹn chưa được duyệt. Vui lòng duyệt cuộc hẹn trước khi tham gia gọi video.';
  }
  if (message.includes('not authorized')) {
    return 'Bạn không có quyền tham gia cuộc gọi này.';
  }
  if (message.includes('not found')) {
    return 'Không tìm thấy cuộc hẹn.';
  }
  return message;
}
