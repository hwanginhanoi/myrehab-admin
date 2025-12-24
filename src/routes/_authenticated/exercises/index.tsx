import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Exercises } from '@/features/exercises'

const exercisesSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  // Per-column text filter (search by title)
  title: z.string().optional().catch(''),
  // Category filter (multiple category IDs)
  categoryIds: z
    .preprocess(
      (val) => {
        // Handle string "undefined" or other invalid values
        if (val === 'undefined' || val === '' || val === null) return undefined
        // If it's already an array, return it
        if (Array.isArray(val)) {
          return val.map(Number).filter(n => !isNaN(n))
        }
        // If it's a single value, convert to array
        const num = Number(val)
        return isNaN(num) ? undefined : [num]
      },
      z.array(z.number()).optional()
    )
    .catch(undefined),
  // Group filter (multiple group IDs)
  groupIds: z
    .preprocess(
      (val) => {
        // Handle string "undefined" or other invalid values
        if (val === 'undefined' || val === '' || val === null) return undefined
        // If it's already an array, return it
        if (Array.isArray(val)) {
          return val.map(Number).filter(n => !isNaN(n))
        }
        // If it's a single value, convert to array
        const num = Number(val)
        return isNaN(num) ? undefined : [num]
      },
      z.array(z.number()).optional()
    )
    .catch(undefined),
})

export const Route = createFileRoute('/_authenticated/exercises/')({
  validateSearch: exercisesSearchSchema,
  component: Exercises,
})
