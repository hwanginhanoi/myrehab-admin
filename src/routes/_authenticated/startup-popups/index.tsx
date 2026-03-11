import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { StartupPopups } from '@/features/startup-popups'
import { StartupPopupsProvider } from '@/features/startup-popups/components/startup-popups-provider'

const startupPopupsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
})

export const Route = createFileRoute('/_authenticated/startup-popups/')({
  validateSearch: startupPopupsSearchSchema,
  component: () => (
    <StartupPopupsProvider>
      <StartupPopups />
    </StartupPopupsProvider>
  ),
})
