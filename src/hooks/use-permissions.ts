import { useAuthStore } from '@/stores/auth-store'

export function usePermissions() {
  const { userType, user } = useAuthStore()

  const isSuperAdmin = userType === 'SUPER_ADMIN'
  const permissions = user?.role ?? []

  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true
    return permissions.includes(permission)
  }

  const hasAnyPermission = (perms: string[]): boolean => {
    if (isSuperAdmin) return true
    return perms.some((p) => permissions.includes(p))
  }

  return { permissions, hasPermission, hasAnyPermission }
}
