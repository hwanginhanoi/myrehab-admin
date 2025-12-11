import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ExerciseCategories } from '@/features/exercise-categories'
import { CategoryType } from '@/lib/constants/category-type'

const categoriesSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  // Facet filters
  type: z
    .array(
      z.enum([
        CategoryType.BODY_PART,
        CategoryType.RECOVERY_STAGE,
        CategoryType.HEALTH_CONDITION,
        CategoryType.DIFFICULTY_LEVEL,
        CategoryType.EXERCISE_TYPE,
      ])
    )
    .optional()
    .catch([]),
  // Per-column text filter (example for name)
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/exercise-categories/')({
  validateSearch: categoriesSearchSchema,
  component: ExerciseCategories,
})
