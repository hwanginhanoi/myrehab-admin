import { useCallback, useEffect, useRef, useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import AgoraRTC from 'agora-rtc-sdk-ng'
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { useGetVideoToken, useMarkComplete } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

const route = getRouteApi('/_authenticated/appointments/$id_/video-call')

const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
})

export function VideoCall() {
  const { id } = route.useParams()
  const {
    data: tokenData,
    isLoading,
    error,
  } = useGetVideoToken(Number(id), {
    query: { staleTime: 0 },
  })

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Đang kết nối...</span>
      </div>
    )
  }

  if (error || !tokenData?.token || !tokenData?.appId) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-destructive'>
          Không thể kết nối cuộc gọi video. Vui lòng thử lại.
        </p>
      </div>
    )
  }

  return (
    <VideoCallRoom
      appId={tokenData.appId}
      channelName={tokenData.channelName!}
      token={tokenData.token}
      uid={tokenData.userAccount!}
      appointmentId={Number(id)}
    />
  )
}

type VideoCallRoomProps = {
  appId: string
  channelName: string
  token: string
  uid: string
  appointmentId: number
}

function VideoCallRoom({
  appId,
  channelName,
  token,
  uid,
  appointmentId,
}: VideoCallRoomProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null)
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null)
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<IRemoteVideoTrack | null>(null)
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<IRemoteAudioTrack | null>(null)
  const [hasRemoteUser, setHasRemoteUser] = useState(false)

  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)

  // Join channel, set up event listeners, create & publish local tracks
  useEffect(() => {
    let cancelled = false
    let audioTrack: IMicrophoneAudioTrack | null = null
    let videoTrack: ICameraVideoTrack | null = null

    // Set up event listeners before joining
    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) => {
      await agoraClient.subscribe(user, mediaType)
      if (mediaType === 'video') {
        setRemoteVideoTrack(user.videoTrack ?? null)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(user.audioTrack ?? null)
      }
    }

    const handleUserUnpublished = (
      _user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) => {
      if (mediaType === 'video') {
        setRemoteVideoTrack(null)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(null)
      }
    }

    const handleUserJoined = () => {
      setHasRemoteUser(true)
    }

    const handleUserLeft = () => {
      setRemoteVideoTrack(null)
      setRemoteAudioTrack(null)
      setHasRemoteUser(false)
    }

    agoraClient.on('user-joined', handleUserJoined)
    agoraClient.on('user-published', handleUserPublished)
    agoraClient.on('user-unpublished', handleUserUnpublished)
    agoraClient.on('user-left', handleUserLeft)

    async function init() {
      await agoraClient.join(appId, channelName, token, uid)
      audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      videoTrack = await AgoraRTC.createCameraVideoTrack()

      if (cancelled) {
        audioTrack.close()
        videoTrack.close()
        return
      }

      await agoraClient.publish([audioTrack, videoTrack])
      setLocalAudioTrack(audioTrack)
      setLocalVideoTrack(videoTrack)
    }

    init()

    return () => {
      cancelled = true
      agoraClient.off('user-joined', handleUserJoined)
      agoraClient.off('user-published', handleUserPublished)
      agoraClient.off('user-unpublished', handleUserUnpublished)
      agoraClient.off('user-left', handleUserLeft)
      audioTrack?.close()
      videoTrack?.close()
      agoraClient.leave()
    }
  }, [appId, channelName, token, uid])

  // Play local video
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current)
      return () => {
        localVideoTrack.stop()
      }
    }
  }, [localVideoTrack])

  // Play/stop remote video
  useEffect(() => {
    if (remoteVideoTrack && remoteVideoRef.current) {
      remoteVideoTrack.play(remoteVideoRef.current)
      return () => {
        remoteVideoTrack.stop()
      }
    }
  }, [remoteVideoTrack])

  // Play/stop remote audio
  useEffect(() => {
    if (remoteAudioTrack) {
      remoteAudioTrack.play()
      return () => {
        remoteAudioTrack.stop()
      }
    }
  }, [remoteAudioTrack])

  const markComplete = useMarkComplete({
    mutation: {
      onSuccess: () => {
        toast.success('Đã đánh dấu hoàn thành')
        queryClient.invalidateQueries({
          queryKey: [
            {
              url: '/api/appointments/:id',
              params: { id: appointmentId },
            },
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/appointments/admin/all' }],
        })
        navigate({
          to: '/appointments/$id',
          params: { id: String(appointmentId) },
        })
      },
      onError: () => {
        toast.error('Có lỗi xảy ra')
      },
    },
  })

  const handleEndCall = useCallback(() => {
    localVideoTrack?.close()
    localAudioTrack?.close()
    agoraClient.leave()
    navigate({
      to: '/appointments/$id',
      params: { id: String(appointmentId) },
    })
  }, [localVideoTrack, localAudioTrack, navigate, appointmentId])

  const handleMarkComplete = useCallback(() => {
    markComplete.mutate({ id: appointmentId })
  }, [markComplete, appointmentId])

  const toggleMic = useCallback(async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(isMuted)
      setIsMuted((prev) => !prev)
    }
  }, [localAudioTrack, isMuted])

  const toggleCamera = useCallback(async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(isCameraOff)
      setIsCameraOff((prev) => !prev)
    }
  }, [localVideoTrack, isCameraOff])

  return (
    <div className='relative h-screen w-full bg-black'>
      {/* Remote video - fullscreen */}
      <div className='h-full w-full'>
        {hasRemoteUser ? (
          <>
            <div ref={remoteVideoRef} className='h-full w-full' />
            {!remoteVideoTrack && (
              <div className='absolute inset-0 flex items-center justify-center bg-gray-800 text-white'>
                <VideoOff className='h-12 w-12' />
              </div>
            )}
          </>
        ) : (
          <div className='flex h-full items-center justify-center text-white'>
            <p>Đang chờ người tham gia...</p>
          </div>
        )}
      </div>

      {/* Local video - PiP overlay */}
      <div className='absolute right-4 bottom-24 z-10 h-48 w-36 overflow-hidden rounded-lg border-2 border-white/30 shadow-lg'>
        {!isCameraOff && localVideoTrack ? (
          <div ref={localVideoRef} className='h-full w-full' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-800 text-white'>
            <VideoOff className='h-8 w-8' />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className='absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3'>
        <Button
          variant={isMuted ? 'destructive' : 'secondary'}
          size='icon'
          className='h-12 w-12 rounded-full'
          onClick={toggleMic}
        >
          {isMuted ? (
            <MicOff className='h-5 w-5' />
          ) : (
            <Mic className='h-5 w-5' />
          )}
        </Button>

        <Button
          variant={isCameraOff ? 'destructive' : 'secondary'}
          size='icon'
          className='h-12 w-12 rounded-full'
          onClick={toggleCamera}
        >
          {isCameraOff ? (
            <VideoOff className='h-5 w-5' />
          ) : (
            <Video className='h-5 w-5' />
          )}
        </Button>

        <Button
          variant='secondary'
          size='icon'
          className='h-12 w-12 rounded-full'
          onClick={handleMarkComplete}
          disabled={markComplete.isPending}
        >
          {markComplete.isPending ? (
            <Loader2 className='h-5 w-5 animate-spin' />
          ) : (
            <CheckCircle className='h-5 w-5 text-green-500' />
          )}
        </Button>

        <Button
          variant='destructive'
          size='icon'
          className='h-12 w-12 rounded-full'
          onClick={handleEndCall}
        >
          <PhoneOff className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
