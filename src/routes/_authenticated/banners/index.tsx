import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Banners } from '@/features/banners'
import { BannersProvider } from '@/features/banners/components/banners-provider'
import { BannerStatus } from '@/lib/constants/banner-status'

const bannersSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  title: z.string().optional().catch(''),
  status: z
    .enum([BannerStatus.ACTIVE, BannerStatus.INACTIVE, BannerStatus.ARCHIVED])
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute('/_authenticated/banners/')({
  validateSearch: bannersSearchSchema,
  component: () => (
    <BannersProvider>
      <Banners />
    </BannersProvider>
  ),
})
