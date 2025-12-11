import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Exercises } from '@/features/exercises'

const exercisesSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  // Per-column text filter
  title: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/exercises/')({
  validateSearch: exercisesSearchSchema,
  component: Exercises,
})
