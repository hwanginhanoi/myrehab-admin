'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  /**
   * Single permission required to access the route
   */
  permission?: string;

  /**
   * Array of permissions - user must have at least one
   */
  anyPermissions?: string[];

  /**
   * Array of permissions - user must have all of them
   */
  allPermissions?: string[];

  /**
   * Required role (only ADMIN and DOCTOR for this admin panel)
   */
  role?: 'ADMIN' | 'DOCTOR';

  /**
   * Content to render when user has permission
   */
  children: ReactNode;

  /**
   * Redirect path when user doesn't have permission
   * @default '/unauthorized'
   */
  redirectTo?: string;

  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Protects entire routes/pages based on user permissions and roles.
 * Redirects unauthorized users to a specified path.
 * Works with the existing AuthContext.
 *
 * @example
 * // Protect a page with single permission
 * export default function CoursesPage() {
 *   return (
 *     <ProtectedRoute permission={PERMISSIONS.COURSE_READ}>
 *       <CourseList />
 *     </ProtectedRoute>
 *   );
 * }
 */
export function ProtectedRoute({
  permission,
  anyPermissions,
  allPermissions,
  role,
  children,
  redirectTo = '/unauthorized',
  loadingComponent,
}: ProtectedRouteProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check permissions after loading is complete
    if (isLoading) return;

    // If no user, redirect to login
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Check permissions and role
    let hasAccess = true;

    if (permission && !hasPermission(permission)) {
      hasAccess = false;
    }

    if (anyPermissions && !hasAnyPermission(anyPermissions)) {
      hasAccess = false;
    }

    if (allPermissions && !hasAllPermissions(allPermissions)) {
      hasAccess = false;
    }

    if (role && !hasRole(role)) {
      hasAccess = false;
    }

    if (!hasAccess) {
      router.push(redirectTo);
    }
  }, [
    isLoading,
    user,
    permission,
    anyPermissions,
    allPermissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    router,
    redirectTo,
  ]);

  // Show loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until we verify access
  if (!user) {
    return null;
  }

  // Check if user has access
  let hasAccess = true;

  if (permission && !hasPermission(permission)) {
    hasAccess = false;
  }

  if (anyPermissions && !hasAnyPermission(anyPermissions)) {
    hasAccess = false;
  }

  if (allPermissions && !hasAllPermissions(allPermissions)) {
    hasAccess = false;
  }

  if (role && !hasRole(role)) {
    hasAccess = false;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
