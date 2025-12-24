import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ExercisePackages } from '@/features/exercise-packages'

const exercisePackagesSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  // Per-column text filter (search by title)
  title: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/exercise-packages/')({
  validateSearch: exercisePackagesSearchSchema,
  component: ExercisePackages,
})
