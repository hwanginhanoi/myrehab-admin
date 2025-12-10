import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ExerciseGroups } from '@/features/exercise-groups'

const groupsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter (example for name)
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/exercise-groups/')({
  validateSearch: groupsSearchSchema,
  component: ExerciseGroups,
})
