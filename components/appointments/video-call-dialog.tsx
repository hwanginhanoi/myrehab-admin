'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAgoraVideoCall } from '@/lib/hooks/use-agora-video-call';
import { VideoPlayer } from './video-player';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { formatTimeRemaining, getTimeUntilEnd } from '@/lib/utils/agora';

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agoraConfig: {
    appId: string;
    channel: string;
    token: string;
    uid: number;
  } | null;
  patientName?: string;
  appointmentEndTime: string;
  durationMinutes: number;
}

export function VideoCallDialog({
  open,
  onOpenChange,
  agoraConfig,
  patientName,
  appointmentEndTime,
  durationMinutes,
}: VideoCallDialogProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const {
    isJoined,
    isConnecting,
    isMuted,
    isCameraOff,
    remoteUsers,
    localVideoTrack,
    error,
    join,
    leave,
    toggleMute,
    toggleCamera,
  } = useAgoraVideoCall({
    onError: (err) => {
      console.error('Agora error:', err);
    },
  });

  // Join call when dialog opens and config is available
  useEffect(() => {
    if (open && agoraConfig && !isJoined && !isConnecting) {
      join(agoraConfig);
    }
  }, [open, agoraConfig, isJoined, isConnecting, join]);

  // Leave call when dialog closes
  useEffect(() => {
    if (!open && isJoined) {
      leave();
    }
  }, [open, isJoined, leave]);

  // Update time remaining
  useEffect(() => {
    if (!open || !appointmentEndTime) return;

    const updateTimer = () => {
      const remaining = getTimeUntilEnd(appointmentEndTime, durationMinutes);
      setTimeRemaining(remaining);

      // Auto-close when time is up
      if (remaining <= 0) {
        onOpenChange(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [open, appointmentEndTime, durationMinutes, onOpenChange]);

  const handleEndCall = useCallback(async () => {
    await leave();
    onOpenChange(false);
  }, [leave, onOpenChange]);

  const remoteUser = remoteUsers[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center justify-between">
            <span>Cuộc gọi video - {patientName || 'Bệnh nhân'}</span>
            {timeRemaining > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                Kết thúc sau {formatTimeRemaining(timeRemaining, 'vi')}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col p-6 pt-2">
          {/* Error display */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || 'Đã xảy ra lỗi khi kết nối cuộc gọi'}
              </AlertDescription>
            </Alert>
          )}

          {/* Connecting state */}
          {isConnecting && (
            <div className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg">
              <div className="text-center text-white">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                <p>Đang kết nối...</p>
              </div>
            </div>
          )}

          {/* Video grid */}
          {isJoined && (
            <div className="flex-1 relative">
              {/* Remote video (patient) - full screen */}
              <div className="absolute inset-0">
                <VideoPlayer
                  videoTrack={remoteUser?.videoTrack}
                  audioTrack={remoteUser?.audioTrack}
                  userName={patientName}
                  className="w-full h-full"
                />

                {!remoteUser && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                    <div className="text-center text-white">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                      <p>Đang chờ bệnh nhân tham gia...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Local video (doctor) - picture in picture */}
              {localVideoTrack && (
                <div className="absolute bottom-4 right-4 w-64 h-48 z-10">
                  <VideoPlayer
                    videoTrack={isCameraOff ? null : localVideoTrack}
                    userName="Bạn"
                    isMuted={isMuted}
                    isLocal
                    className="w-full h-full border-2 border-white shadow-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          {isJoined && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant={isMuted ? 'destructive' : 'secondary'}
                size="lg"
                onClick={toggleMute}
                className="rounded-full w-14 h-14"
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant={isCameraOff ? 'destructive' : 'secondary'}
                size="lg"
                onClick={toggleCamera}
                className="rounded-full w-14 h-14"
              >
                {isCameraOff ? (
                  <VideoOff className="h-6 w-6" />
                ) : (
                  <VideoIcon className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndCall}
                className="rounded-full w-14 h-14"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
