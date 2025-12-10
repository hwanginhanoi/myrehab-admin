import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { auth } = useAuthStore.getState()

    // Skip auth check in development mode if no token exists
    // This allows testing protected routes without logging in
    const isDevelopment = import.meta.env.DEV

    // Check if user has valid token
    if (!auth.accessToken) {
      if (isDevelopment) {
        // In development, allow access but set a mock user
        auth.setUser({
          accountNo: 'dev-user',
          email: 'dev@example.com',
          role: ['admin'],
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        })
        auth.setAccessToken('dev-token')
        return
      }

      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    // Check if token is expired (skip in development)
    if (!isDevelopment && auth.user && auth.user.exp < Date.now()) {
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
