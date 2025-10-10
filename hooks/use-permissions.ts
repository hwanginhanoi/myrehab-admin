'use client';

import { useAuth } from '@/contexts/auth-context';
import { PERMISSIONS } from '@/types/permissions';

/**
 * usePermissions Hook
 *
 * Provides convenient permission checking functions for common use cases.
 * Works with the existing AuthContext.
 *
 * @example
 * const { canReadCourses, canWriteCourses, isAdmin } = usePermissions();
 *
 * if (canWriteCourses) {
 *   // Show create course button
 * }
 */
export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } = useAuth();

  return {
    // User Management (patient users)
    canReadUsers: hasPermission(PERMISSIONS.USER_READ),
    canWriteUsers: hasPermission(PERMISSIONS.USER_WRITE),
    canDeleteUsers: hasPermission(PERMISSIONS.USER_DELETE),
    canManageUsers: hasAnyPermission([
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_WRITE,
      PERMISSIONS.USER_DELETE,
    ]),

    // Doctor Management
    canReadDoctors: hasPermission(PERMISSIONS.DOCTOR_READ),
    canWriteDoctors: hasPermission(PERMISSIONS.DOCTOR_WRITE),
    canDeleteDoctors: hasPermission(PERMISSIONS.DOCTOR_DELETE),
    canManageDoctors: hasAnyPermission([
      PERMISSIONS.DOCTOR_READ,
      PERMISSIONS.DOCTOR_WRITE,
      PERMISSIONS.DOCTOR_DELETE,
    ]),

    // Admin Management
    canReadAdmins: hasPermission(PERMISSIONS.ADMIN_READ),
    canWriteAdmins: hasPermission(PERMISSIONS.ADMIN_WRITE),
    canDeleteAdmins: hasPermission(PERMISSIONS.ADMIN_DELETE),
    canManageAdmins: hasAnyPermission([
      PERMISSIONS.ADMIN_READ,
      PERMISSIONS.ADMIN_WRITE,
      PERMISSIONS.ADMIN_DELETE,
    ]),

    // Course Management
    canReadCourses: hasPermission(PERMISSIONS.COURSE_READ),
    canWriteCourses: hasPermission(PERMISSIONS.COURSE_WRITE),
    canDeleteCourses: hasPermission(PERMISSIONS.COURSE_DELETE),
    canManageCourses: hasAnyPermission([
      PERMISSIONS.COURSE_READ,
      PERMISSIONS.COURSE_WRITE,
      PERMISSIONS.COURSE_DELETE,
    ]),

    // Exercise Management
    canReadExercises: hasPermission(PERMISSIONS.EXERCISE_READ),
    canWriteExercises: hasPermission(PERMISSIONS.EXERCISE_WRITE),
    canDeleteExercises: hasPermission(PERMISSIONS.EXERCISE_DELETE),
    canManageExercises: hasAnyPermission([
      PERMISSIONS.EXERCISE_READ,
      PERMISSIONS.EXERCISE_WRITE,
      PERMISSIONS.EXERCISE_DELETE,
    ]),

    // Category Management
    canReadCategories: hasPermission(PERMISSIONS.CATEGORY_READ),
    canWriteCategories: hasPermission(PERMISSIONS.CATEGORY_WRITE),
    canDeleteCategories: hasPermission(PERMISSIONS.CATEGORY_DELETE),
    canManageCategories: hasAnyPermission([
      PERMISSIONS.CATEGORY_READ,
      PERMISSIONS.CATEGORY_WRITE,
      PERMISSIONS.CATEGORY_DELETE,
    ]),

    // Patient Management
    canViewPatients: hasPermission(PERMISSIONS.PATIENT_VIEW),
    canAssignCourseToPatient: hasPermission(PERMISSIONS.PATIENT_ASSIGN_COURSE),
    canViewPatientHistory: hasPermission(PERMISSIONS.PATIENT_VIEW_HISTORY),
    canManagePatients: hasAnyPermission([
      PERMISSIONS.PATIENT_VIEW,
      PERMISSIONS.PATIENT_ASSIGN_COURSE,
      PERMISSIONS.PATIENT_VIEW_HISTORY,
    ]),

    // Purchase Management
    canViewPurchases: hasPermission(PERMISSIONS.PURCHASE_VIEW),
    canManagePurchases: hasPermission(PERMISSIONS.PURCHASE_MANAGE),

    // Permission Management
    canReadPermissions: hasPermission(PERMISSIONS.PERMISSION_READ),
    canWritePermissions: hasPermission(PERMISSIONS.PERMISSION_WRITE),
    canManagePermissions: hasAnyPermission([
      PERMISSIONS.PERMISSION_READ,
      PERMISSIONS.PERMISSION_WRITE,
    ]),

    // Role checks (only ADMIN and DOCTOR for this admin panel)
    isAdmin: hasRole('ADMIN'),
    isDoctor: hasRole('DOCTOR'),

    // Utility functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}
