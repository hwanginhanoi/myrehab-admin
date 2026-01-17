import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { News } from '@/features/news'
import { CategoryType } from '@/lib/constants/news-catergories'
import { NewsStatus } from '@/lib/constants/news-status'

const newsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  // Filter by title
  title: z.string().optional().catch(''),
  // Filter by status (single select)
  status: z
    .enum([
      NewsStatus.DRAFT,
      NewsStatus.PUBLISHED,
      NewsStatus.ARCHIVED,
    ])
    .optional()
    .catch(undefined),
  // Filter by category (single select)
  category: z
    .enum([
      CategoryType.GENERAL,
      CategoryType.HEALTH_TIPS,
      CategoryType.REHABILITATION,
      CategoryType.CLINIC_NEWS,
      CategoryType.SUCCESS_STORIES,
    ])
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute('/_authenticated/news/')({
  validateSearch: newsSearchSchema,
  component: News,
})
