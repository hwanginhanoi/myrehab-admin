import { useCallback, useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import AgoraRTC, {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from 'agora-rtc-react'
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

const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

export function VideoCall() {
  const { id } = route.useParams()
  const { data: tokenData, isLoading, error } = useGetVideoToken(Number(id), {
    query: { staleTime: 0 },
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang kết nối...</span>
      </div>
    )
  }

  if (error || !tokenData?.token || !tokenData?.appId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-destructive">
          Không thể kết nối cuộc gọi video. Vui lòng thử lại.
        </p>
      </div>
    )
  }

  return (
    <AgoraRTCProvider client={agoraClient}>
      <VideoCallRoom
        appId={tokenData.appId}
        channelName={tokenData.channelName!}
        token={tokenData.token}
        uid={tokenData.uid!}
        appointmentId={Number(id)}
      />
    </AgoraRTCProvider>
  )
}

type VideoCallRoomProps = {
  appId: string
  channelName: string
  token: string
  uid: number
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

  useJoin({ appid: appId, channel: channelName, token, uid })

  const { localCameraTrack } = useLocalCameraTrack(!isCameraOff)
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(!isMuted)

  usePublish([localMicrophoneTrack, localCameraTrack])

  const remoteUsers = useRemoteUsers()

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
    localCameraTrack?.close()
    localMicrophoneTrack?.close()
    navigate({
      to: '/appointments/$id',
      params: { id: String(appointmentId) },
    })
  }, [localCameraTrack, localMicrophoneTrack, navigate, appointmentId])

  const handleMarkComplete = useCallback(() => {
    markComplete.mutate({ id: appointmentId })
  }, [markComplete, appointmentId])

  const toggleMic = useCallback(() => {
    localMicrophoneTrack?.setEnabled(isMuted)
    setIsMuted((prev) => !prev)
  }, [localMicrophoneTrack, isMuted])

  const toggleCamera = useCallback(() => {
    setIsCameraOff((prev) => !prev)
  }, [])

  return (
    <div className="relative h-screen w-full bg-black">
      {/* Remote video - fullscreen */}
      <div className="h-full w-full">
        {remoteUsers.length > 0 ? (
          <RemoteUser
            user={remoteUsers[0]}
            playVideo={true}
            playAudio={true}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white">
            <p>Đang chờ người tham gia...</p>
          </div>
        )}
      </div>

      {/* Local video - PiP overlay */}
      <div className="absolute right-4 bottom-24 z-10 h-48 w-36 overflow-hidden rounded-lg border-2 border-white/30 shadow-lg">
        {!isCameraOff && localCameraTrack ? (
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white">
            <VideoOff className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
        <Button
          variant={isMuted ? 'destructive' : 'secondary'}
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={toggleMic}
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant={isCameraOff ? 'destructive' : 'secondary'}
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={toggleCamera}
        >
          {isCameraOff ? (
            <VideoOff className="h-5 w-5" />
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handleMarkComplete}
          disabled={markComplete.isPending}
        >
          {markComplete.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
