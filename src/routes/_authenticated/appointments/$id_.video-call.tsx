import { createFileRoute } from '@tanstack/react-router'
import { VideoCall } from '@/features/appointment-detail/video-call'

export const Route = createFileRoute(
  '/_authenticated/appointments/$id_/video-call'
)({
  component: VideoCall,
})
