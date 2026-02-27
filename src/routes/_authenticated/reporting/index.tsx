import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Reporting } from '@/features/reporting'

export const Route = createFileRoute('/_authenticated/reporting/')({
  beforeLoad: async () => {
    const { userType } = useAuthStore.getState()
    if (userType !== 'SUPER_ADMIN') {
      throw redirect({
        to: '/exercises',
        search: { categoryIds: [], groupIds: [] },
      })
    }
  },
  component: Reporting,
})
