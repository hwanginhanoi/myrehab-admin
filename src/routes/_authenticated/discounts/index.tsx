import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Discounts } from '@/features/discounts'
import { DiscountsProvider } from '@/features/discounts/components/discounts-provider'

const discountsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
})

export const Route = createFileRoute('/_authenticated/discounts/')({
  beforeLoad: async () => {
    const { userType } = useAuthStore.getState()
    if (userType !== 'SUPER_ADMIN' && userType !== 'ADMIN') {
      throw redirect({ to: '/' })
    }
  },
  validateSearch: discountsSearchSchema,
  component: () => (
    <DiscountsProvider>
      <Discounts />
    </DiscountsProvider>
  ),
})
