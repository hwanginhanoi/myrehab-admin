'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  Settings,
  User,
  SwitchCamera,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAgoraVideoCall } from '@/hooks/use-agora-video-call';
import { validateAgoraConfig } from '@/lib/agora-config';

export default function VideoCallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Channel from URL or default
  const [channelName, setChannelName] = useState(searchParams.get('channel') || '');
  const [isConfigured, setIsConfigured] = useState(false);

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
    channel: channelName,
  });

  useEffect(() => {
    setIsConfigured(validateAgoraConfig());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error('Video Call Error', {
        description: error,
      });
    }
  }, [error]);

  const handleJoinChannel = async () => {
    if (!channelName.trim()) {
      toast.error('Channel name is required');
      return;
    }

    if (!isConfigured) {
      toast.error('Agora is not configured', {
        description: 'Please add NEXT_PUBLIC_AGORA_APP_ID to your environment variables',
      });
      return;
    }

    await joinChannel();
  };

  const handleLeaveChannel = async () => {
    await leaveChannel();
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 flex flex-col bg-gray-900">
        {!isJoined ? (
          // Pre-call screen
          <div className="flex-1 flex items-center justify-center p-9">
            <Card className="max-w-md w-full p-8 bg-white">
              <div className="mb-6 text-center">
                <div className="h-16 w-16 rounded-full bg-[#6DBAD6]/10 flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-[#6DBAD6]" />
                </div>
                <h1 className="text-3xl font-bold text-[#EF7F26] mb-2">
                  Video Call
                </h1>
                <p className="text-[#71717A]">
                  Enter a channel name to start or join a video call
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="channel" className="text-[#020617] font-medium">
                    Channel Name
                  </Label>
                  <Input
                    id="channel"
                    type="text"
                    placeholder="e.g., consultation-room-1"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="mt-1.5"
                    disabled={isLoading}
                  />
                </div>

                {!isConfigured && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Configuration Required:</strong> Please add your Agora App ID to the environment variables.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleJoinChannel}
                  disabled={isLoading || !channelName.trim() || !isConfigured}
                  className="w-full bg-[#6DBAD6] hover:bg-[#5BA8C4] text-white"
                  size="lg"
                >
                  {isLoading ? (
                    'Connecting...'
                  ) : (
                    <>
                      <Phone className="mr-2 h-5 w-5" />
                      Join Call
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          // In-call screen
          <div className="flex-1 flex flex-col">
            {/* Video Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {/* Local Video */}
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <div
                  id="local-video"
                  className="w-full h-full"
                  style={{ display: isCameraOff ? 'none' : 'block' }}
                />
                {isCameraOff && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-[#6DBAD6] flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full text-white text-sm font-medium">
                  You {isMicMuted && '(Muted)'}
                </div>
                {localUid && (
                  <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded text-white text-xs">
                    ID: {localUid}
                  </div>
                )}
              </div>

              {/* Remote Videos */}
              {remoteUsers.map((user) => (
                <div
                  key={user.uid}
                  className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div
                    id={`remote-video-${user.uid}`}
                    className="w-full h-full"
                    style={{ display: user.hasVideo ? 'block' : 'none' }}
                  />
                  {!user.hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full text-white text-sm font-medium">
                    User {user.uid} {!user.hasAudio && '(Muted)'}
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {remoteUsers.length === 0 && (
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <User className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Waiting for others to join...</p>
                    </div>
                  </div>
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
                  title={isMicMuted ? 'Unmute' : 'Mute'}
                >
                  {isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                {/* Camera */}
                <Button
                  onClick={toggleCamera}
                  size="lg"
                  variant={isCameraOff ? 'destructive' : 'secondary'}
                  className="h-14 w-14 rounded-full"
                  title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                </Button>

                {/* Switch Camera */}
                <Button
                  onClick={switchCamera}
                  size="lg"
                  variant="secondary"
                  className="h-14 w-14 rounded-full"
                  title="Switch camera"
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
                  Leave Call
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
