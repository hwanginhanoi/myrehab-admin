import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RehabilitationForms } from '@/features/rehabilitation-forms'

const rehabilitationFormsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  patientName: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/rehabilitation-forms/')({
  validateSearch: rehabilitationFormsSearchSchema,
  component: RehabilitationForms,
})
