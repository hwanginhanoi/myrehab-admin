import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Banners } from '@/features/banners'

const bannersSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  title: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/banners/')({
  validateSearch: bannersSearchSchema,
  component: Banners,
})
