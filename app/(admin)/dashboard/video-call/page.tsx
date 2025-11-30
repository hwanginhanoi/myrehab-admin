'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  User,
  SwitchCamera,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAgoraVideoCall } from '@/hooks/use-agora-video-call';
import { formatTimeRemaining, getTimeUntilEnd } from '@/lib/utils/agora';

export default function VideoCallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL - ALL from backend response
  const appointmentId = searchParams.get('appointmentId');
  const channelFromUrl = searchParams.get('channel');
  const tokenFromUrl = searchParams.get('token');
  const appIdFromUrl = searchParams.get('appId');
  const uidFromUrl = searchParams.get('uid');
  const patientName = searchParams.get('patientName') || 'Bệnh nhân';
  const endTime = searchParams.get('endTime');
  const duration = parseInt(searchParams.get('duration') || '60');

  const [channelName, setChannelName] = useState(channelFromUrl || '');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [autoJoined, setAutoJoined] = useState(false);

  const {
    isJoined,
    isLoading,
    error,
    remoteUsers,
    localUid,
    isMicMuted,
    isCameraOff,
    joinChannel,
    leaveChannel,
    toggleMicrophone,
    toggleCamera,
    switchCamera,
  } = useAgoraVideoCall({
    appId: appIdFromUrl || '',           // EXACT from backend
    channel: channelName,                 // EXACT from backend
    token: tokenFromUrl || null,          // EXACT from backend
    uid: uidFromUrl ? parseInt(uidFromUrl) : null, // EXACT from backend
  });

  // Debug: Log Agora configuration - EXACT backend values
  useEffect(() => {
    if (appointmentId) {
      console.log('🎥 Agora Config (EXACT Backend Values):', {
        appId: appIdFromUrl,
        channel: channelName,
        uid: uidFromUrl,
        hasToken: !!tokenFromUrl,
        tokenPreview: tokenFromUrl ? `${tokenFromUrl.substring(0, 20)}...` : 'none',
        tokenSource: 'backend-api',
        note: '✅ Using EXACT values from backend response - NO modifications',
      });
    }
  }, [appointmentId, appIdFromUrl, channelName, uidFromUrl, tokenFromUrl]);

  // Debug: Log remote users when they change
  useEffect(() => {
    console.log('👥 Remote users updated:', {
      count: remoteUsers.length,
      users: remoteUsers.map(u => ({
        uid: u.uid,
        hasAudio: u.hasAudio,
        hasVideo: u.hasVideo,
      })),
    });

    // Check if video containers exist in DOM
    remoteUsers.forEach(user => {
      const container = document.getElementById(`remote-video-${user.uid}`);
      console.log(`🔍 DOM check for user ${user.uid}:`, {
        containerExists: !!container,
        containerId: `remote-video-${user.uid}`,
      });
    });
  }, [remoteUsers]);

  // Update time remaining for appointment
  useEffect(() => {
    if (!endTime || !isJoined) return;

    const updateTimer = () => {
      const remaining = getTimeUntilEnd(endTime, duration);
      setTimeRemaining(remaining);

      // Auto-leave when time is up
      if (remaining <= 0) {
        toast.warning('Cuộc hẹn đã kết thúc', {
          description: 'Thời gian cuộc hẹn đã hết',
        });
        void handleLeaveChannel();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime, duration, isJoined]);

  // Auto-join if coming from appointment
  useEffect(() => {
    if (appointmentId && channelFromUrl && !autoJoined && !isJoined) {
      if (!tokenFromUrl) {
        toast.error('Lỗi', {
          description: 'Không có token từ backend. Vui lòng thử lại.',
        });
        return;
      }
      if (!appIdFromUrl) {
        toast.error('Lỗi', {
          description: 'Không có App ID từ backend. Vui lòng kiểm tra cấu hình.',
        });
        return;
      }
      setAutoJoined(true);
      void joinChannel();
    }
  }, [appointmentId, channelFromUrl, tokenFromUrl, appIdFromUrl, autoJoined, isJoined, joinChannel]);

  useEffect(() => {
    if (error) {
      let errorMessage = error;

      // Provide user-friendly error messages
      if (error.includes('invalid token') || error.includes('CAN_NOT_GET_GATEWAY_SERVER')) {
        errorMessage = 'Token không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại hoặc thử tham gia lại cuộc gọi.';
      } else if (error.includes('App ID')) {
        errorMessage = 'Cấu hình App ID không đúng. Vui lòng liên hệ quản trị viên.';
      }

      toast.error('Lỗi gọi video', {
        description: errorMessage,
      });
    }
  }, [error]);

  const handleJoinChannel = async () => {
    if (!channelName.trim()) {
      toast.error('Vui lòng nhập tên kênh');
      return;
    }

    await joinChannel();
  };

  const handleLeaveChannel = async () => {
    await leaveChannel();
    if (appointmentId) {
      // Return to appointment details if came from appointment
      router.push(`/dashboard/appointments/${appointmentId}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 flex flex-col bg-gray-900">
        {!isJoined ? (
          // Pre-call screen
          <div className="flex-1 flex items-center justify-center p-9">
            <Card className="max-w-md w-full p-8 bg-white">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => appointmentId ? router.push(`/dashboard/appointments/${appointmentId}`) : router.push('/dashboard')}
                  className="mb-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại
                </Button>

                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-[#6DBAD6]/10 flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-[#6DBAD6]" />
                  </div>
                  <h1 className="text-3xl font-bold text-[#EF7F26] mb-2">
                    {appointmentId ? `Cuộc gọi với ${patientName}` : 'Cuộc gọi video'}
                  </h1>
                  <p className="text-[#71717A]">
                    {isLoading ? 'Đang kết nối...' : 'Nhấn tham gia để bắt đầu cuộc gọi'}
                  </p>
                </div>
              </div>

              {!appointmentId && (
                <div className="mb-4">
                  <label htmlFor="channel" className="text-[#020617] font-medium block mb-2">
                    Tên kênh
                  </label>
                  <input
                    id="channel"
                    type="text"
                    placeholder="Nhập tên kênh"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleJoinChannel}
                  disabled={isLoading || !channelName.trim()}
                  className="w-full bg-[#6DBAD6] hover:bg-[#5BA8C4] text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang kết nối...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-5 w-5" />
                      Tham gia cuộc gọi
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => appointmentId ? router.push(`/dashboard/appointments/${appointmentId}`) : router.push('/dashboard')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  Hủy
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          // In-call screen
          <div className="flex-1 flex flex-col">
            {/* Header */}
            {appointmentId && (
              <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
                <div className="flex items-center justify-between text-white">
                  <h2 className="text-lg font-semibold">Cuộc gọi với {patientName}</h2>
                  {timeRemaining > 0 && (
                    <div className="text-sm text-gray-300">
                      Kết thúc sau {formatTimeRemaining(timeRemaining, 'vi')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Container - Optimized for 2 people */}
            <div className="flex-1 relative bg-gray-900">
              {/* Main Video (Remote User - Patient) */}
              {remoteUsers.length > 0 ? (
                <div className="absolute inset-0">
                  {/* Always render video container, never hide it with display:none */}
                  <div
                    id={`remote-video-${remoteUsers[0].uid}`}
                    className="w-full h-full"
                  />
                  {!remoteUsers[0].hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 pointer-events-none">
                      <div className="text-center">
                        <div className="h-24 w-24 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-4">
                          <User className="h-12 w-12 text-white" />
                        </div>
                        <p className="text-white text-lg font-medium">{patientName}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 bg-black/60 px-4 py-2 rounded-full text-white font-medium">
                    {patientName}
                    {!remoteUsers[0].hasAudio && ' (Đã tắt tiếng)'}
                  </div>
                </div>
              ) : (
                /* Waiting for patient */
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-300 text-lg">
                      {appointmentId ? `Đang chờ ${patientName} tham gia...` : 'Đang chờ người khác tham gia...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Picture-in-Picture: Local Video (Doctor) */}
              <div className="absolute top-4 right-4 w-64 aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
                <div
                  id="local-video"
                  className="w-full h-full"
                  style={{ display: isCameraOff ? 'none' : 'block' }}
                />
                {isCameraOff && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-[#6DBAD6] flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-full text-white text-xs font-medium">
                  Bạn {isMicMuted && '(Tắt tiếng)'}
                </div>
                {localUid && (
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-white text-xs">
                    ID: {localUid}
                  </div>
                )}
              </div>

              {/* Additional remote users (if more than 2 people) */}
              {remoteUsers.length > 1 && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {remoteUsers.slice(1).map((user) => (
                    <div
                      key={user.uid}
                      className="w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-gray-700"
                    >
                      <div
                        id={`remote-video-${user.uid}`}
                        className="w-full h-full"
                        style={{ display: user.hasVideo ? 'block' : 'none' }}
                      />
                      {!user.hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-full text-white text-xs">
                        Người dùng {user.uid}
                        {!user.hasAudio && ' (Tắt tiếng)'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Control Bar */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
                {/* Microphone */}
                <Button
                  onClick={toggleMicrophone}
                  size="lg"
                  variant={isMicMuted ? 'destructive' : 'secondary'}
                  className="h-14 w-14 rounded-full"
                  title={isMicMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                >
                  {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                {/* Camera */}
                <Button
                  onClick={toggleCamera}
                  size="lg"
                  variant={isCameraOff ? 'destructive' : 'secondary'}
                  className="h-14 w-14 rounded-full"
                  title={isCameraOff ? 'Bật camera' : 'Tắt camera'}
                >
                  {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </Button>

                {/* Switch Camera */}
                <Button
                  onClick={switchCamera}
                  size="lg"
                  variant="secondary"
                  className="h-14 w-14 rounded-full"
                  title="Chuyển camera"
                >
                  <SwitchCamera className="h-6 w-6" />
                </Button>

                {/* Leave Call */}
                <Button
                  onClick={handleLeaveChannel}
                  size="lg"
                  variant="destructive"
                  className="h-14 px-8 rounded-full"
                  disabled={isLoading}
                >
                  <PhoneOff className="h-6 w-6 mr-2" />
                  Kết thúc
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
