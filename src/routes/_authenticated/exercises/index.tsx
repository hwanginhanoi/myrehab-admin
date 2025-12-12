import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Exercises } from '@/features/exercises'

const exercisesSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  // Per-column text filter
  title: z.string().optional().catch(''),
  // Category filter
  categoryId: z
    .preprocess(
      (val) => {
        // Handle string "undefined" or other invalid values
        if (val === 'undefined' || val === '' || val === null) return undefined
        const num = Number(val)
        return isNaN(num) ? undefined : num
      },
      z.number().optional()
    )
    .catch(undefined),
})

export const Route = createFileRoute('/_authenticated/exercises/')({
  validateSearch: exercisesSearchSchema,
  component: Exercises,
})
