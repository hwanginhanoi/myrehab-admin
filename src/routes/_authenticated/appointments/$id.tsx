import { createFileRoute } from '@tanstack/react-router'
import { AppointmentDetail } from '@/features/appointment-detail'

export const Route = createFileRoute('/_authenticated/appointments/$id')({
  component: AppointmentDetail,
})
