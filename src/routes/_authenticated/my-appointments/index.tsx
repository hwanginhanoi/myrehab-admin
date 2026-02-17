import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { MyAppointments } from '@/features/my-appointments'

const myAppointmentsSearchSchema = z.object({
  date: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/my-appointments/')({
  validateSearch: myAppointmentsSearchSchema,
  component: MyAppointments,
})
