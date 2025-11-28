'use client';

import { useEffect, useRef } from 'react';
import type { ICameraVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoTrack?: ICameraVideoTrack | IRemoteVideoTrack | null;
  audioTrack?: unknown;
  className?: string;
  style?: React.CSSProperties;
  isMuted?: boolean;
  userName?: string;
  isLocal?: boolean;
}

export function VideoPlayer({
  videoTrack,
  audioTrack,
  className,
  style,
  isMuted,
  userName,
  isLocal = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoTrack.play(videoRef.current);
    }

    return () => {
      if (videoTrack) {
        videoTrack.stop();
      }
    };
  }, [videoTrack]);

  useEffect(() => {
    if (audioTrack && !isLocal) {
      const track = audioTrack as { play: () => void; stop: () => void };
      track.play();
    }

    return () => {
      if (audioTrack && !isLocal) {
        const track = audioTrack as { play: () => void; stop: () => void };
        track.stop();
      }
    };
  }, [audioTrack, isLocal]);

  return (
    <div
      className={cn(
        'relative bg-gray-900 rounded-lg overflow-hidden',
        className
      )}
      style={style}
    >
      <div
        ref={videoRef}
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />

      {/* User name overlay */}
      {userName && (
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {userName}
        </div>
      )}

      {/* Muted indicator */}
      {isMuted && (
        <div className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
      )}

      {/* No video indicator */}
      {!videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-700 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            {userName && <p className="text-sm font-medium">{userName}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
