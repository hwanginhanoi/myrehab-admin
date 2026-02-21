import { createFileRoute } from '@tanstack/react-router'
import { AppointmentVideoCall } from '@/features/appointment-detail/video-call'

export const Route = createFileRoute('/_authenticated/appointments/$id/video-call')({
  component: AppointmentVideoCall,
})
