import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Appointments } from '@/features/appointments'

const appointmentsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  status: z.array(z.string()).optional().catch([]),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/appointments/')({
  validateSearch: appointmentsSearchSchema,
  component: Appointments,
})
