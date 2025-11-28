'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

export interface AgoraConfig {
  appId: string;
  channel: string;
  token: string;
  uid: number;
}

export interface UseAgoraVideoCallOptions {
  onUserJoined?: (user: IAgoraRTCRemoteUser) => void;
  onUserLeft?: (user: IAgoraRTCRemoteUser) => void;
  onError?: (error: Error) => void;
}

export interface AgoraVideoCallState {
  isJoined: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  remoteUsers: IAgoraRTCRemoteUser[];
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  error: Error | null;
}

export function useAgoraVideoCall(options: UseAgoraVideoCallOptions = {}) {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const [state, setState] = useState<AgoraVideoCallState>({
    isJoined: false,
    isConnecting: false,
    isMuted: false,
    isCameraOff: false,
    remoteUsers: [],
    localVideoTrack: null,
    localAudioTrack: null,
    error: null,
  });

  // Initialize Agora client
  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    // Set up event listeners
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      setState((prev) => ({
        ...prev,
        remoteUsers: prev.remoteUsers.some((u) => u.uid === user.uid)
          ? prev.remoteUsers.map((u) => (u.uid === user.uid ? user : u))
          : [...prev.remoteUsers, user],
      }));

      options.onUserJoined?.(user);
    });

    client.on('user-unpublished', (user) => {
      setState((prev) => ({
        ...prev,
        remoteUsers: prev.remoteUsers.filter((u) => u.uid !== user.uid),
      }));
    });

    client.on('user-left', (user) => {
      setState((prev) => ({
        ...prev,
        remoteUsers: prev.remoteUsers.filter((u) => u.uid !== user.uid),
      }));

      options.onUserLeft?.(user);
    });

    return () => {
      client.removeAllListeners();
    };
  }, [options]);

  // Join channel
  const join = useCallback(async (config: AgoraConfig) => {
    const client = clientRef.current;
    if (!client) {
      const error = new Error('Agora client not initialized');
      setState((prev) => ({ ...prev, error }));
      options.onError?.(error);
      return;
    }

    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      // Join the channel
      await client.join(config.appId, config.channel, config.token, config.uid);

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      await client.publish([audioTrack, videoTrack]);

      setState((prev) => ({
        ...prev,
        isJoined: true,
        isConnecting: false,
        localAudioTrack: audioTrack,
        localVideoTrack: videoTrack,
        error: null,
      }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to join channel');
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: err,
      }));
      options.onError?.(err);
    }
  }, [options]);

  // Leave channel
  const leave = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      // Stop and close local tracks
      if (state.localAudioTrack) {
        state.localAudioTrack.stop();
        state.localAudioTrack.close();
      }
      if (state.localVideoTrack) {
        state.localVideoTrack.stop();
        state.localVideoTrack.close();
      }

      // Leave the channel
      await client.leave();

      setState({
        isJoined: false,
        isConnecting: false,
        isMuted: false,
        isCameraOff: false,
        remoteUsers: [],
        localVideoTrack: null,
        localAudioTrack: null,
        error: null,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to leave channel');
      setState((prev) => ({ ...prev, error: err }));
      options.onError?.(err);
    }
  }, [state.localAudioTrack, state.localVideoTrack, options]);

  // Toggle microphone
  const toggleMute = useCallback(async () => {
    if (!state.localAudioTrack) return;

    try {
      const newMutedState = !state.isMuted;
      await state.localAudioTrack.setEnabled(!newMutedState);
      setState((prev) => ({ ...prev, isMuted: newMutedState }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to toggle microphone');
      setState((prev) => ({ ...prev, error: err }));
      options.onError?.(err);
    }
  }, [state.localAudioTrack, state.isMuted, options]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (!state.localVideoTrack) return;

    try {
      const newCameraState = !state.isCameraOff;
      await state.localVideoTrack.setEnabled(!newCameraState);
      setState((prev) => ({ ...prev, isCameraOff: newCameraState }));
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to toggle camera');
      setState((prev) => ({ ...prev, error: err }));
      options.onError?.(err);
    }
  }, [state.localVideoTrack, state.isCameraOff, options]);

  // Cleanup on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => {
      if (state.isJoined) {
        leave();
      }
    };
  }, []);

  return {
    ...state,
    join,
    leave,
    toggleMute,
    toggleCamera,
  };
}
