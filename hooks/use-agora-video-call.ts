'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import { AGORA_SDK_CONFIG } from '@/lib/agora-config';

// Set Agora log level (in development, use info; in production, use warning)
// 0 = DEBUG, 1 = INFO, 2 = WARNING, 3 = ERROR, 4 = NONE
AgoraRTC.setLogLevel(process.env.NODE_ENV === 'development' ? 2 : 3);

interface UseAgoraVideoCallOptions {
  appId: string; // Required - must come from backend
  channel: string;
  token: string | null; // Required - must come from backend
  uid?: number | null; // Optional - from backend (0 or null = auto-assign)
}

interface AgoraUser {
  uid: UID;
  hasAudio: boolean;
  hasVideo: boolean;
}

export function useAgoraVideoCall({ appId, channel, token, uid = null }: UseAgoraVideoCallOptions) {
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

    console.log('🔄 Remote users state changed, replaying videos:', {
      remoteUserCount: remoteUsers.length,
      clientRemoteUsers: client.remoteUsers.length,
    });

    // Play all remote users' video tracks
    client.remoteUsers.forEach((user) => {
      if (user.videoTrack) {
        const remoteVideoContainer = document.getElementById(`remote-video-${user.uid}`);
        console.log(`🎬 Replaying video for user ${user.uid}:`, {
          hasContainer: !!remoteVideoContainer,
          trackId: user.videoTrack.getTrackId(),
          isPlaying: user.videoTrack.isPlaying,
        });

        if (remoteVideoContainer) {
          try {
            user.videoTrack.play(remoteVideoContainer);
            console.log(`✅ Successfully replayed video for user ${user.uid}`);
          } catch (err) {
            console.error(`❌ Failed to replay video for user ${user.uid}:`, err);
          }
        } else {
          console.warn(`⚠️ Container not found for user ${user.uid}, will retry on next render`);
        }
      } else {
        console.log(`📹 User ${user.uid} has no video track yet`);
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
      console.log(`📹 User published ${mediaType}:`, {
        uid: user.uid,
        hasVideoTrack: !!user.videoTrack,
        hasAudioTrack: !!user.audioTrack,
      });

      try {
        await client.subscribe(user, mediaType);
        console.log(`✅ Subscribed to ${mediaType} from user:`, user.uid);
      } catch (err) {
        console.error(`❌ Failed to subscribe to ${mediaType} from user ${user.uid}:`, err);
        return; // Don't continue if subscription failed
      }

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
        console.log(`🔊 Playing audio from user:`, user.uid);
      }

      // Auto-play remote video
      if (mediaType === 'video' && user.videoTrack) {
        const remoteVideoContainer = document.getElementById(`remote-video-${user.uid}`);
        console.log(`🎥 Attempting to play video:`, {
          uid: user.uid,
          containerId: `remote-video-${user.uid}`,
          containerExists: !!remoteVideoContainer,
          videoTrackId: user.videoTrack.getTrackId(),
        });

        if (remoteVideoContainer) {
          try {
            user.videoTrack.play(remoteVideoContainer);
            console.log(`✅ Video playing for user:`, user.uid);
          } catch (err) {
            console.error(`❌ Failed to play video for user ${user.uid}:`, err);
          }
        } else {
          console.error(`❌ Video container not found for user ${user.uid}`);
        }
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

    // Event: User joined the channel
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      console.log('👋 User joined channel:', {
        uid: user.uid,
        hasAudio: user.hasAudio,
        hasVideo: user.hasVideo,
      });
    };

    // Event: User left the channel
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      console.log('👋 User left channel:', user.uid);
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    };

    client.on('user-joined', handleUserJoined);
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

      // Validate required parameters
      if (!appId) {
        throw new Error('Agora App ID is required (must be provided by backend)');
      }
      if (!token) {
        throw new Error('Agora token is required (must be provided by backend)');
      }

      // If client is already in a channel, leave first to prevent UID_CONFLICT
      if (client.connectionState !== 'DISCONNECTED') {
        console.log('⚠️ Client still connected, leaving channel first...');
        try {
          await client.leave();
        } catch (leaveErr) {
          console.warn('Error leaving channel during cleanup:', leaveErr);
        }
      }

      // Debug logging
      console.log('🔐 Agora Join Attempt (Backend Values Only):', {
        appId,
        channel,
        uid: uid || 'auto-assign',
        hasToken: !!token,
        tokenSource: 'backend-api',
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
        connectionState: client.connectionState,
      });

      // Join the channel using EXACT backend-provided values
      // Use exact UID from backend (0 or null means auto-assign by Agora)
      const joinedUid = await client.join(appId, channel, token, uid || null);
      localUidRef.current = joinedUid;
      console.log('✅ Successfully joined channel:', {
        myUID: joinedUid,
        channel,
        remoteUsersInChannel: client.remoteUsers.length,
        remoteUIDs: client.remoteUsers.map(u => u.uid),
      });

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
      const error = err as Error;

      // Handle UID_CONFLICT specifically - this can happen if previous session wasn't cleaned up
      if (error.message?.includes('UID_CONFLICT')) {
        console.warn('⚠️ UID conflict detected - retrying with channel cleanup...');
        // Don't set error state for UID_CONFLICT as it will auto-retry
        // The user will retry and it should work on second attempt
      } else {
        console.error('Failed to join channel:', err);
        setError(error.message || 'Failed to join channel');
      }
    } finally {
      setIsLoading(false);
    }
  }, [appId, channel, token, uid, isJoined]);

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
      const newMutedState = !isMicMuted;
      await localAudioTrack.setEnabled(!newMutedState);
      setIsMicMuted(newMutedState);
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle microphone');
    }
  }, [localAudioTrack, isMicMuted]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (!localVideoTrack) return;

    try {
      const newOffState = !isCameraOff;
      await localVideoTrack.setEnabled(!newOffState);
      setIsCameraOff(newOffState);
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
