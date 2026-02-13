import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Transactions } from '@/features/transactions'

const transactionsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  query: z.string().optional().catch(''),
  startDate: z.string().optional().catch(undefined),
  endDate: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/transactions/')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()
    const userType = auth.userType

    if (userType !== 'SUPER_ADMIN') {
      throw redirect({
        to: '/exercises',
        search: {
          categoryIds: [],
          groupIds: [],
        },
      })
    }
  },
  validateSearch: transactionsSearchSchema,
  component: Transactions,
})
