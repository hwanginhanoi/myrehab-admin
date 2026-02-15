import { createFileRoute } from '@tanstack/react-router'
import { ClinicSchedule } from '@/features/clinic-schedule'

export const Route = createFileRoute('/_authenticated/clinic-schedule/')({
  component: ClinicSchedule,
})
