// Permission System - 27 hardcoded permissions
// This admin panel is only for DOCTOR and ADMIN users

export const PERMISSIONS = {
  // User Management (patient users)
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',

  // Doctor Management
  DOCTOR_READ: 'doctor:read',
  DOCTOR_WRITE: 'doctor:write',
  DOCTOR_DELETE: 'doctor:delete',

  // Admin Management
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
  ADMIN_DELETE: 'admin:delete',

  // Course Management
  COURSE_READ: 'course:read',
  COURSE_WRITE: 'course:write',
  COURSE_DELETE: 'course:delete',

  // Exercise Management
  EXERCISE_READ: 'exercise:read',
  EXERCISE_WRITE: 'exercise:write',
  EXERCISE_DELETE: 'exercise:delete',

  // Category Management
  CATEGORY_READ: 'category:read',
  CATEGORY_WRITE: 'category:write',
  CATEGORY_DELETE: 'category:delete',

  // Patient Management
  PATIENT_VIEW: 'patient:view',
  PATIENT_ASSIGN_COURSE: 'patient:assign-course',
  PATIENT_VIEW_HISTORY: 'patient:view-history',

  // Purchase Management
  PURCHASE_VIEW: 'purchase:view',
  PURCHASE_MANAGE: 'purchase:manage',

  // Permission Management
  PERMISSION_READ: 'permission:read',
  PERMISSION_WRITE: 'permission:write',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// User roles - Only ADMIN and DOCTOR for this admin panel
export type UserRole = 'ADMIN' | 'DOCTOR';

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
  phoneNumber?: string;
}
