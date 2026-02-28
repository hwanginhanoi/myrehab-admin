import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { accessToken, user, reset } = useAuthStore.getState()

    // Check if user has valid token
    if (!accessToken) {
      throw redirect({
        to: '/login',
        search: () => ({
          redirect: location.href,
        }),
      })
    }

    // Check if token is expired
    if (user && user.exp < Date.now()) {
      reset()
      throw redirect({
        to: '/login',
        search: () => ({
          redirect: location.href,
        }),
      })
    }
  },
  component: AuthenticatedLayout,
})
