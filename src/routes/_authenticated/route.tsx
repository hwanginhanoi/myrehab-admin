import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { auth } = useAuthStore.getState()

    // Check if user has valid token
    if (!auth.accessToken) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    // Check if token is expired
    if (auth.user && auth.user.exp < Date.now()) {
      auth.reset()
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})
