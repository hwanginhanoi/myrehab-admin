'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import { AGORA_CONFIG, AGORA_SDK_CONFIG } from '@/lib/agora-config';

// Set Agora log level (in development, use info; in production, use warning)
// 0 = DEBUG, 1 = INFO, 2 = WARNING, 3 = ERROR, 4 = NONE
AgoraRTC.setLogLevel(process.env.NODE_ENV === 'development' ? 2 : 3);

interface UseAgoraVideoCallOptions {
  appId?: string;
  channel: string;
  token?: string | null;
  useHardcodedToken?: boolean;
}

interface AgoraUser {
  uid: UID;
  hasAudio: boolean;
  hasVideo: boolean;
}

export function useAgoraVideoCall({ appId, channel, token = null, useHardcodedToken = true }: UseAgoraVideoCallOptions) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<AgoraUser[]>([]);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localUidRef = useRef<UID | null>(null);

  // Play local video track when it becomes available
  useEffect(() => {
    if (localVideoTrack && isJoined) {
      const localVideoContainer = document.getElementById('local-video');
      if (localVideoContainer) {
        localVideoTrack.play(localVideoContainer);
      }
    }
  }, [localVideoTrack, isJoined]);

  // Play remote video tracks when users join or video elements mount
  useEffect(() => {
    const client = clientRef.current;
    if (!client || !isJoined) return;

    // Play all remote users' video tracks
    client.remoteUsers.forEach((user) => {
      if (user.videoTrack) {
        const remoteVideoContainer = document.getElementById(`remote-video-${user.uid}`);
        if (remoteVideoContainer) {
          user.videoTrack.play(remoteVideoContainer);
        }
      }
    });
  }, [remoteUsers, isJoined]);

  // Initialize Agora client
  useEffect(() => {
    const client = AgoraRTC.createClient({
      mode: 'rtc',
      codec: AGORA_SDK_CONFIG.codec,
    });

    clientRef.current = client;

    // Event: User published (remote user started sharing audio/video)
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);

      setRemoteUsers((prev) => {
        const existingUser = prev.find((u) => u.uid === user.uid);
        if (existingUser) {
          return prev.map((u) =>
            u.uid === user.uid
              ? {
                  ...u,
                  hasAudio: mediaType === 'audio' ? true : u.hasAudio,
                  hasVideo: mediaType === 'video' ? true : u.hasVideo,
                }
              : u
          );
        }
        return [
          ...prev,
          {
            uid: user.uid,
            hasAudio: mediaType === 'audio',
            hasVideo: mediaType === 'video',
          },
        ];
      });

      // Auto-play remote audio
      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play();
      }
    };

    // Event: User unpublished (remote user stopped sharing audio/video)
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      setRemoteUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? {
                ...u,
                hasAudio: mediaType === 'audio' ? false : u.hasAudio,
                hasVideo: mediaType === 'video' ? false : u.hasVideo,
              }
            : u
        )
      );
    };

    // Event: User left the channel
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, []);

  // Join channel
  const joinChannel = useCallback(async () => {
    const client = clientRef.current;
    if (!client || isJoined) return;

    try {
      setIsLoading(true);
      setError(null);

      const effectiveAppId = appId || AGORA_CONFIG.appId;
      if (!effectiveAppId) {
        throw new Error('Agora App ID is required');
      }

      // Use hardcoded token if enabled, otherwise use provided token
      const effectiveToken = useHardcodedToken ? AGORA_CONFIG.token : token;

      // Join the channel
      const uid = await client.join(effectiveAppId, channel, effectiveToken, null);
      localUidRef.current = uid;

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        {
          encoderConfig: AGORA_SDK_CONFIG.audioEncoderConfig,
        },
        {
          encoderConfig: AGORA_SDK_CONFIG.videoEncoderConfig,
        }
      );

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Publish tracks to the channel
      await client.publish([audioTrack, videoTrack]);

      setIsJoined(true);
    } catch (err) {
      console.error('Failed to join channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to join channel');
    } finally {
      setIsLoading(false);
    }
  }, [appId, channel, token, isJoined, useHardcodedToken]);

  // Leave channel
  const leaveChannel = useCallback(async () => {
    const client = clientRef.current;
    if (!client || !isJoined) return;

    try {
      setIsLoading(true);

      // Stop and close local tracks
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }

      // Leave the channel
      await client.leave();

      setIsJoined(false);
      setRemoteUsers([]);
      localUidRef.current = null;
    } catch (err) {
      console.error('Failed to leave channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to leave channel');
    } finally {
      setIsLoading(false);
    }
  }, [isJoined, localAudioTrack, localVideoTrack]);

  // Toggle microphone
  const toggleMicrophone = useCallback(async () => {
    if (!localAudioTrack) return;

    try {
      await localAudioTrack.setEnabled(!isMicMuted);
      setIsMicMuted(!isMicMuted);
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle microphone');
    }
  }, [localAudioTrack, isMicMuted]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (!localVideoTrack) return;

    try {
      await localVideoTrack.setEnabled(!isCameraOff);
      setIsCameraOff(!isCameraOff);
    } catch (err) {
      console.error('Failed to toggle camera:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle camera');
    }
  }, [localVideoTrack, isCameraOff]);

  // Switch camera (front/back on mobile)
  const switchCamera = useCallback(async () => {
    if (!localVideoTrack) return;

    try {
      const devices = await AgoraRTC.getCameras();
      if (devices.length < 2) {
        console.warn('Only one camera available');
        return;
      }

      const currentDeviceId = localVideoTrack.getTrackLabel();
      const nextDevice = devices.find((device) => device.deviceId !== currentDeviceId);

      if (nextDevice) {
        await localVideoTrack.setDevice(nextDevice.deviceId);
      }
    } catch (err) {
      console.error('Failed to switch camera:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch camera');
    }
  }, [localVideoTrack]);

  // Get remote user's video track
  const getRemoteVideoTrack = useCallback(
    (uid: UID) => {
      const client = clientRef.current;
      if (!client) return null;

      const remoteUser = client.remoteUsers.find((user) => user.uid === uid);
      return remoteUser?.videoTrack || null;
    },
    []
  );

  return {
    // State
    isJoined,
    isLoading,
    error,
    remoteUsers,
    localUid: localUidRef.current,
    isMicMuted,
    isCameraOff,

    // Actions
    joinChannel,
    leaveChannel,
    toggleMicrophone,
    toggleCamera,
    switchCamera,
    getRemoteVideoTrack,
  };
}
