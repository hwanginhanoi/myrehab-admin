import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type IAgoraRTCRemoteUser,
  type IRemoteVideoTrack,
  type IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { useGetVideoToken, useGetAppointmentById, useStartStt, useStopStt } from '@/api'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Loader2,
  Captions,
} from 'lucide-react'
import { decodeSttMessage } from '@/lib/stt-proto'

const route = getRouteApi('/_authenticated/appointments/$id_/video-call')

export function VideoCall() {
  const { id } = route.useParams()
  const {
    data: tokenData,
    isLoading,
    error,
  } = useGetVideoToken(Number(id), {
    query: { staleTime: 0 },
  })
  const { data: appointment } = useGetAppointmentById(Number(id))

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Đang kết nối...</span>
      </div>
    )
  }

  if (error || !tokenData?.token || !tokenData?.appId || !tokenData?.uid) {
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
      uid={tokenData.uid}
      appointmentId={Number(id)}
      sttLanguage={appointment?.sttLanguage}
    />
  )
}

const STT_TRANSLATION_BOT_UID = 1001
const STT_SUBSCRIBER_BOT_UID = 1000

type VideoCallRoomProps = {
  appId: string
  channelName: string
  token: string
  uid: number
  appointmentId: number
  sttLanguage?: string
}

function VideoCallRoom({
  appId,
  channelName,
  token,
  uid,
  appointmentId,
  sttLanguage,
}: VideoCallRoomProps) {
  const navigate = useNavigate()
  const userType = useAuthStore((state) => state.userType)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const agoraClient = useMemo<IAgoraRTCClient>(
    () => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
    []
  )
  const hasLeft = useRef(false)
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null)
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null)
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<IRemoteVideoTrack | null>(null)
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<IRemoteAudioTrack | null>(null)
  const [hasRemoteUser, setHasRemoteUser] = useState(false)
  const [isSttActive, setIsSttActive] = useState(false)
  const [subtitle, setSubtitle] = useState<{
    original: string
    translated: string
    isFinal: boolean
    isLocal: boolean
  } | null>(null)

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
      if (user.uid === STT_SUBSCRIBER_BOT_UID) return
      // Subscribe to translation bot so we receive stream-message data
      if (user.uid === STT_TRANSLATION_BOT_UID) {
        await agoraClient.subscribe(user, mediaType)
        return
      }
      await agoraClient.subscribe(user, mediaType)
      if (mediaType === 'video') {
        setRemoteVideoTrack(user.videoTrack ?? null)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(user.audioTrack ?? null)
      }
    }

    const handleUserUnpublished = (
      user: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video'
    ) => {
      if (user.uid === STT_SUBSCRIBER_BOT_UID || user.uid === STT_TRANSLATION_BOT_UID) return
      if (mediaType === 'video') {
        setRemoteVideoTrack(null)
      }
      if (mediaType === 'audio') {
        setRemoteAudioTrack(null)
      }
    }

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      if (user.uid === STT_SUBSCRIBER_BOT_UID || user.uid === STT_TRANSLATION_BOT_UID) return
      setHasRemoteUser(true)
    }

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      if (user.uid === STT_SUBSCRIBER_BOT_UID || user.uid === STT_TRANSLATION_BOT_UID) return
      setRemoteVideoTrack(null)
      setRemoteAudioTrack(null)
      setHasRemoteUser(false)
    }

    const handleStreamMessage = (senderUid: number, payload: Uint8Array) => {
      if (senderUid !== STT_TRANSLATION_BOT_UID) return
      try {
        const msg = decodeSttMessage(payload)

        const text = msg.words.map((w) => w.text).join('')
        const isFinal = msg.words.length > 0 && msg.words[msg.words.length - 1].isFinal
        const translated = msg.trans?.[0]?.texts?.join('') || ''
        const speakerUid = Number(msg.uid) || 0
        const isLocal = speakerUid === uid

        setSubtitle({
          original: text,
          translated,
          isFinal,
          isLocal,
        })
        if (isFinal) setTimeout(() => setSubtitle(null), 4000)
      } catch { /* ignore malformed messages */ }
    }

    agoraClient.on('user-joined', handleUserJoined)
    agoraClient.on('user-published', handleUserPublished)
    agoraClient.on('user-unpublished', handleUserUnpublished)
    agoraClient.on('user-left', handleUserLeft)
    agoraClient.on('stream-message', handleStreamMessage)

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
      agoraClient.off('stream-message', handleStreamMessage)
      if (!hasLeft.current) {
        hasLeft.current = true
        if (isSttActiveRef.current) {
          stopSttRef.current({ id: appointmentId }).catch(() => {})
        }
        audioTrack?.stop()
        audioTrack?.close()
        videoTrack?.stop()
        videoTrack?.close()
        agoraClient.leave().catch(() => {})
      }
    }
  }, [appId, channelName, token, uid, agoraClient, appointmentId])

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

  const startStt = useStartStt()
  const stopStt = useStopStt()
  const isSttActiveRef = useRef(false)
  const stopSttRef = useRef(stopStt.mutateAsync)
  stopSttRef.current = stopStt.mutateAsync

  const leaveCall = useCallback(async () => {
    if (hasLeft.current) return
    hasLeft.current = true

    // Stop STT if active
    if (isSttActiveRef.current) {
      stopStt.mutateAsync({ id: appointmentId }).catch(() => {})
    }

    // Stop and close local tracks
    localAudioTrack?.stop()
    localAudioTrack?.close()
    localVideoTrack?.stop()
    localVideoTrack?.close()

    // Await leave to ensure full cleanup before navigating
    await agoraClient.leave().catch(() => {})
  }, [localVideoTrack, localAudioTrack, agoraClient, stopStt, appointmentId])

  const toggleStt = useCallback(async () => {
    if (isSttActive) {
      await stopStt.mutateAsync({ id: appointmentId })
      setIsSttActive(false)
      isSttActiveRef.current = false
      setSubtitle(null)
    } else {
      await startStt.mutateAsync({ id: appointmentId })
      setIsSttActive(true)
      isSttActiveRef.current = true
    }
  }, [isSttActive, startStt, stopStt, appointmentId])

  const handleEndCall = useCallback(async () => {
    await leaveCall()
    if (userType === 'DOCTOR') {
      navigate({ to: '/my-appointments' })
    } else {
      navigate({
        to: '/appointments/$id',
        params: { id: String(appointmentId) },
      })
    }
  }, [leaveCall, navigate, appointmentId, userType])

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

      {/* Subtitle overlay */}
      {subtitle && (
        <div className={`absolute bottom-24 left-1/2 z-20 w-[80%] max-w-2xl -translate-x-1/2 rounded-lg px-4 py-3 text-center ${subtitle.isLocal ? 'bg-blue-900/70' : 'bg-black/70'}`}>
          <span className={`text-xs font-medium ${subtitle.isLocal ? 'text-blue-300' : 'text-gray-400'}`}>
            {subtitle.isLocal ? 'Bạn' : 'Đối phương'}
          </span>
          <p className={subtitle.isFinal ? 'text-sm text-white' : 'text-sm italic text-white/60'}>
            {subtitle.original}
          </p>
          {subtitle.translated && (
            <p className={subtitle.isFinal ? 'mt-1 text-sm text-yellow-300' : 'mt-1 text-sm italic text-yellow-300/60'}>
              {subtitle.translated}
            </p>
          )}
        </div>
      )}

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

        {sttLanguage === 'EN_US' && (
          <Button
            variant={isSttActive ? 'default' : 'secondary'}
            size='icon'
            className='h-12 w-12 rounded-full'
            onClick={toggleStt}
            disabled={startStt.isPending || stopStt.isPending}
          >
            {startStt.isPending || stopStt.isPending ? (
              <Loader2 className='h-5 w-5 animate-spin' />
            ) : (
              <Captions className='h-5 w-5' />
            )}
          </Button>
        )}

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
