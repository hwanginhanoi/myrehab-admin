'use client';

import { useAuth } from '@/contexts/auth-context';
import { ReactNode } from 'react';

interface ProtectedActionProps {
  /**
   * Single permission required to view the children
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
   * Content to render when user doesn't have permission
   */
  fallback?: ReactNode;

  /**
   * Whether to show loading state
   */
  showLoading?: boolean;

  /**
   * Custom loading component
   */
  loadingFallback?: ReactNode;
}

/**
 * ProtectedAction Component
 *
 * Conditionally renders children based on user permissions and roles.
 * Works with the existing AuthContext.
 *
 * @example
 * // Single permission
 * <ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>
 *   <button onClick={handleCreateCourse}>Create Course</button>
 * </ProtectedAction>
 *
 * @example
 * // With fallback
 * <ProtectedAction
 *   permission={PERMISSIONS.COURSE_DELETE}
 *   fallback={<span className="text-muted-foreground">No permission</span>}
 * >
 *   <button variant="destructive">Delete</button>
 * </ProtectedAction>
 */
export function ProtectedAction({
  permission,
  anyPermissions,
  allPermissions,
  role,
  children,
  fallback = null,
  showLoading = false,
  loadingFallback = null,
}: ProtectedActionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isLoading } = useAuth();

  // Show loading state if enabled
  if (isLoading && showLoading) {
    return <>{loadingFallback}</>;
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
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
