import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: async () => {
    const { auth } = useAuthStore.getState()
    const userType = auth.userType

    // Only SUPER_ADMIN can access the dashboard
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
  component: Dashboard,
})
