import { useState } from 'react'
import { useNavigate, getRouteApi } from '@tanstack/react-router'
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from 'agora-rtc-react'
import { ArrowLeft, CheckCircle, Loader2, Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useGetVideoToken, useMarkComplete } from '@/api'

const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

const route = getRouteApi('/_authenticated/appointments/$id/video-call')

type VideoCallRoomProps = {
  appId: string
  channelName: string
  token: string
  uid: number
  appointmentId: number
  onEnd: () => void
}

function VideoCallRoom({ appId, channelName, token, uid, appointmentId, onEnd }: VideoCallRoomProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const queryClient = useQueryClient()

  const { isLoading: isJoining } = useJoin({ appid: appId, channel: channelName, token, uid })
  const { localCameraTrack } = useLocalCameraTrack()
  const { localMicrophoneTrack } = useLocalMicrophoneTrack()
  usePublish([localMicrophoneTrack, localCameraTrack])
  const remoteUsers = useRemoteUsers()

  const markComplete = useMarkComplete({
    mutation: {
      onSuccess: () => {
        toast.success('Đã đánh dấu hoàn thành')
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/appointments/:id', params: { id: appointmentId } }],
        })
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/admin/all' }] })
        onEnd()
      },
      onError: () => {
        toast.error('Có lỗi xảy ra')
      },
    },
  })

  if (isJoining) {
    return (
      <div className='flex h-full items-center justify-center gap-2'>
        <Loader2 className='h-6 w-6 animate-spin' />
        <span className='text-muted-foreground'>Đang kết nối...</span>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col gap-4'>
      {/* Video area */}
      <div className='relative min-h-0 flex-1 overflow-hidden rounded-xl bg-black'>
        {remoteUsers.length > 0 ? (
          <RemoteUser
            user={remoteUsers[0]}
            playAudio
            playVideo
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <p className='text-white/50'>Đang chờ người tham gia...</p>
          </div>
        )}

        {/* Local video PiP */}
        {localCameraTrack && (
          <div className='absolute right-4 bottom-4 h-28 w-44 overflow-hidden rounded-lg border-2 border-white/20 shadow-2xl'>
            <LocalVideoTrack
              track={localCameraTrack}
              play={!isCameraOff}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className='flex shrink-0 items-center justify-center gap-3 pb-2'>
        <Button
          variant={isMuted ? 'destructive' : 'secondary'}
          size='icon'
          onClick={() => {
            localMicrophoneTrack?.setMuted(!isMuted)
            setIsMuted(!isMuted)
          }}
          title={isMuted ? 'Bật microphone' : 'Tắt microphone'}
        >
          {isMuted ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
        </Button>

        <Button
          variant={isCameraOff ? 'destructive' : 'secondary'}
          size='icon'
          onClick={() => {
            localCameraTrack?.setMuted(!isCameraOff)
            setIsCameraOff(!isCameraOff)
          }}
          title={isCameraOff ? 'Bật camera' : 'Tắt camera'}
        >
          {isCameraOff ? <VideoOff className='h-4 w-4' /> : <Video className='h-4 w-4' />}
        </Button>

        <Button
          onClick={() => markComplete.mutate({ id: appointmentId })}
          disabled={markComplete.isPending}
        >
          {markComplete.isPending ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <CheckCircle className='mr-2 h-4 w-4' />
          )}
          Hoàn thành buổi khám
        </Button>

        <Button variant='destructive' size='icon' onClick={onEnd} title='Kết thúc cuộc gọi'>
          <PhoneOff className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export function AppointmentVideoCall() {
  const { id } = route.useParams()
  const appointmentId = Number(id)
  const navigate = useNavigate()

  const { data: tokenData, isLoading, isError } = useGetVideoToken(appointmentId, {
    query: { staleTime: 0 },
  })

  const goBack = () => navigate({ to: '/appointments/$id', params: { id } })

  const hasValidToken =
    tokenData?.appId &&
    tokenData?.channelName &&
    tokenData?.token &&
    tokenData?.uid !== undefined

  return (
    <>
      <Header fixed>
        <Button variant='ghost' size='icon' onClick={goBack}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <span className='font-semibold'>Cuộc gọi video — Lịch hẹn #{id}</span>
      </Header>

      <Main className='flex flex-col gap-4 pt-4'>
        {isLoading && (
          <div className='flex h-full items-center justify-center gap-2'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='text-muted-foreground'>Đang lấy token...</span>
          </div>
        )}

        {isError && (
          <div className='flex h-full items-center justify-center'>
            <p className='text-destructive'>Không thể tải token cuộc gọi. Vui lòng thử lại.</p>
          </div>
        )}

        {hasValidToken && (
          <AgoraRTCProvider client={agoraClient}>
            <VideoCallRoom
              appId={tokenData.appId!}
              channelName={tokenData.channelName!}
              token={tokenData.token!}
              uid={tokenData.uid!}
              appointmentId={appointmentId}
              onEnd={goBack}
            />
          </AgoraRTCProvider>
        )}
      </Main>
    </>
  )
}
