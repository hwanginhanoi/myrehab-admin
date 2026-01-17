import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Staff } from '@/features/staff'

const staffSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter (search by name or email)
  query: z.string().optional().catch(''),
  // Facet filters
  staffType: z
    .array(
      z.union([
        z.literal('DOCTOR'),
        z.literal('TRAINER'),
        z.literal('ADMIN'),
        z.literal('SUPER_ADMIN'),
      ])
    )
    .optional()
    .catch([]),
  status: z
    .array(z.union([z.literal('active'), z.literal('inactive')]))
    .default(['active']),
})

export const Route = createFileRoute('/_authenticated/staff/')({
  validateSearch: staffSearchSchema,
  component: Staff,
})
