# Permission System - Usage Guide

This guide shows how to use the permission system in MyRehab Admin (DOCTOR and ADMIN users only).

## 🎯 Overview

The permission system is integrated with your existing `AuthContext` and provides:
- **27 permissions** organized by domain
- **2 user roles**: ADMIN and DOCTOR (no regular USER role in admin panel)
- Permission checking via existing `useAuth()` hook
- Helper components for conditional rendering

## 📦 What's Included

### Core Files
- `types/permissions.ts` - Permission constants and types
- `contexts/auth-context.tsx` - Enhanced with permission support
- `hooks/use-permissions.ts` - Convenience hook with domain-specific checks
- `components/ProtectedAction.tsx` - Conditional rendering component
- `components/ProtectedRoute.tsx` - Page-level protection component

## 🚀 Quick Start

### 1. Permission Constants

```typescript
import { PERMISSIONS } from '@/types/permissions';

// Use these constants instead of hardcoded strings
PERMISSIONS.COURSE_READ
PERMISSIONS.COURSE_WRITE
PERMISSIONS.EXERCISE_READ
// ...etc
```

### 2. Check Permissions in Components

```typescript
import { useAuth } from '@/contexts/auth-context';
import { PERMISSIONS } from '@/types/permissions';

export function CourseList() {
  const { hasPermission, isAdmin } = useAuth();

  return (
    <div>
      <h2>Courses</h2>

      {hasPermission(PERMISSIONS.COURSE_WRITE) && (
        <button onClick={handleCreate}>Create Course</button>
      )}

      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### 3. Use Helper Hook

```typescript
import { usePermissions } from '@/hooks/usePermissions';

export function CourseActions() {
  const { canWriteCourses, canDeleteCourses, isAdmin } = usePermissions();

  return (
    <div>
      {canWriteCourses && <button>Edit</button>}
      {canDeleteCourses && <button>Delete</button>}
      {isAdmin && <button>Settings</button>}
    </div>
  );
}
```

### 4. Conditional Rendering with Component

```typescript
import { ProtectedAction } from '@/components/ProtectedAction';
import { PERMISSIONS } from '@/types/permissions';

export function CourseCard({ course }) {
  return (
    <div>
      <h3>{course.name}</h3>

      {/* Only show if user has permission */}
      <ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>
        <button>Edit</button>
      </ProtectedAction>

      {/* With fallback */}
      <ProtectedAction
        permission={PERMISSIONS.COURSE_DELETE}
        fallback={<button disabled>Delete (No Permission)</button>}
      >
        <button>Delete</button>
      </ProtectedAction>

      {/* Admin only */}
      <ProtectedAction role="ADMIN">
        <button>Advanced Settings</button>
      </ProtectedAction>
    </div>
  );
}
```

### 5. Protect Entire Pages

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/types/permissions';

export default function CoursesPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.COURSE_READ}>
      <div>
        <h1>Course Management</h1>
        {/* Page content */}
      </div>
    </ProtectedRoute>
  );
}

// Admin-only page
export default function PermissionsPage() {
  return (
    <ProtectedRoute role="ADMIN">
      <div>
        <h1>Permission Management</h1>
        {/* Admin content */}
      </div>
    </ProtectedRoute>
  );
}
```

## 📚 Available Permissions

```typescript
// User Management (patient users)
USER_READ, USER_WRITE, USER_DELETE

// Doctor Management
DOCTOR_READ, DOCTOR_WRITE, DOCTOR_DELETE

// Admin Management
ADMIN_READ, ADMIN_WRITE, ADMIN_DELETE

// Course Management
COURSE_READ, COURSE_WRITE, COURSE_DELETE

// Exercise Management
EXERCISE_READ, EXERCISE_WRITE, EXERCISE_DELETE

// Category Management
CATEGORY_READ, CATEGORY_WRITE, CATEGORY_DELETE

// Patient Management
PATIENT_VIEW, PATIENT_ASSIGN_COURSE, PATIENT_VIEW_HISTORY

// Purchase Management
PURCHASE_VIEW, PURCHASE_MANAGE

// Permission Management
PERMISSION_READ, PERMISSION_WRITE
```

## 🎨 useAuth Hook API

Your existing `useAuth()` hook now includes permission helpers:

```typescript
const {
  // Existing
  user,
  token,
  login,
  logout,
  isAuthenticated,
  isLoading,

  // New permission helpers
  hasPermission,        // (permission: string) => boolean
  hasAnyPermission,     // (permissions: string[]) => boolean
  hasAllPermissions,    // (permissions: string[]) => boolean
  hasRole,              // (role: 'ADMIN' | 'DOCTOR') => boolean
  refreshUser,          // () => Promise<void>
} = useAuth();
```

## 🛠️ usePermissions Hook API

Convenience hook with domain-specific booleans:

```typescript
const {
  // User Management
  canReadUsers,
  canWriteUsers,
  canDeleteUsers,
  canManageUsers,

  // Course Management
  canReadCourses,
  canWriteCourses,
  canDeleteCourses,
  canManageCourses,

  // Exercise Management
  canReadExercises,
  canWriteExercises,
  canDeleteExercises,
  canManageExercises,

  // ...and more

  // Role checks
  isAdmin,
  isDoctor,

  // Utility functions
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
} = usePermissions();
```

## 💡 Common Patterns

### Pattern 1: Navigation Menu

```typescript
import { usePermissions } from '@/hooks/usePermissions';

export function AppSidebar() {
  const {
    canManageCourses,
    canManageExercises,
    canManageCategories,
    canManageUsers,
    isAdmin,
  } = usePermissions();

  return (
    <nav>
      {canManageCourses && <NavItem href="/dashboard/courses">Courses</NavItem>}
      {canManageExercises && <NavItem href="/dashboard/exercises">Exercises</NavItem>}
      {canManageCategories && <NavItem href="/dashboard/categories">Categories</NavItem>}
      {canManageUsers && <NavItem href="/dashboard/users">Users</NavItem>}
      {isAdmin && <NavItem href="/dashboard/permissions">Permissions</NavItem>}
    </nav>
  );
}
```

### Pattern 2: Table Actions

```typescript
import { ProtectedAction } from '@/components/ProtectedAction';
import { PERMISSIONS } from '@/types/permissions';

export function CourseTableRow({ course }) {
  return (
    <tr>
      <td>{course.name}</td>
      <td className="flex gap-2">
        <ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>
          <button onClick={() => handleEdit(course.id)}>Edit</button>
        </ProtectedAction>

        <ProtectedAction permission={PERMISSIONS.COURSE_DELETE}>
          <button onClick={() => handleDelete(course.id)}>Delete</button>
        </ProtectedAction>
      </td>
    </tr>
  );
}
```

### Pattern 3: Form Fields

```typescript
import { ProtectedAction } from '@/components/ProtectedAction';

export function CourseForm() {
  return (
    <form>
      <input name="name" placeholder="Course Name" />
      <textarea name="description" placeholder="Description" />

      {/* Admin-only fields */}
      <ProtectedAction role="ADMIN">
        <input name="priority" type="number" placeholder="Priority" />
        <input type="checkbox" name="featured" /> Featured Course
      </ProtectedAction>

      <button type="submit">Save</button>
    </form>
  );
}
```

### Pattern 4: API Calls with Permission Check

```typescript
import { useAuth } from '@/contexts/auth-context';
import { PERMISSIONS } from '@/types/permissions';

export function CourseManagement() {
  const { hasPermission } = useAuth();

  async function handleAction(courseId: string) {
    if (hasPermission(PERMISSIONS.COURSE_WRITE)) {
      await updateCourse(courseId);
    }

    if (hasPermission(PERMISSIONS.COURSE_DELETE)) {
      await deleteCourse(courseId);
    }
  }

  return (
    <button onClick={() => handleAction(course.id)}>
      Perform Actions
    </button>
  );
}
```

## 🔒 Backend Integration

### Get Current User with Permissions

When user logs in or refreshes, the `AuthContext` automatically calls:

```typescript
GET /api/users/me

Response:
{
  "id": 1,
  "email": "doctor@myrehab.com",
  "fullName": "Dr. John Doe",
  "role": "DOCTOR",
  "permissions": [
    "course:read",
    "exercise:read",
    "patient:view"
  ],
  "phoneNumber": "+84123456789"
}
```

### Permission Management APIs

```typescript
import {
  getAllPermissions,
  getAdminPermissions,
  getDoctorPermissions,
  setAdminPermissions,
  setDoctorPermissions,
  assignPermissionToAdmin,
  assignPermissionToDoctor,
  removePermissionFromAdmin,
  removePermissionFromDoctor
} from '@/api/api/permissionManagementController';

// Get all available permissions
const allPermissions = await getAllPermissions();
// Returns: string[] of all 27 permissions

// Get admin's permissions
const adminPerms = await getAdminPermissions({ adminId: 123 });

// Set permissions
await setAdminPermissions({
  adminId: 123,
  data: { permissions: ['course:read', 'course:write'] }
});

// Add single permission
await assignPermissionToAdmin({
  adminId: 123,
  data: { permission: 'course:delete' }
});

// Remove permission
await removePermissionFromAdmin({
  adminId: 123,
  permission: 'course:delete'
});
```

## ✅ Best Practices

1. **Always use permission constants**
   ```typescript
   // Good ✅
   <ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>

   // Bad ❌
   <ProtectedAction permission="course:write">
   ```

2. **Provide user feedback**
   ```typescript
   <ProtectedAction
     permission={PERMISSIONS.COURSE_DELETE}
     fallback={<span className="text-muted">No permission</span>}
   >
     <button>Delete</button>
   </ProtectedAction>
   ```

3. **Handle loading states**
   ```typescript
   const { user, isLoading } = useAuth();

   if (isLoading) return <LoadingSpinner />;
   if (!user) return <LoginPrompt />;
   ```

4. **Backend validation is required**
   - Frontend checks are for UX only
   - Always validate permissions on backend

## 🐛 Troubleshooting

### Permissions not loading
- Check if token is valid in localStorage (`authToken`)
- Verify `/api/users/me` endpoint is accessible
- Check console for errors

### User always redirected
- Verify user has correct permissions in database
- Check if role is 'ADMIN' or 'DOCTOR' (not 'USER')

### Permission changes not reflected
- Call `refreshUser()` to reload user data
- Or logout and login again

## 📝 Example: Complete Page

```typescript
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProtectedAction } from '@/components/ProtectedAction';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from '@/types/permissions';

export default function CoursesPage() {
  const { canWriteCourses, canDeleteCourses, isAdmin } = usePermissions();

  return (
    <ProtectedRoute permission={PERMISSIONS.COURSE_READ}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Danh sách lộ trình</h1>

          <ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>
            <button onClick={handleCreate}>Tạo lộ trình mới</button>
          </ProtectedAction>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.category}</td>
                <td className="flex gap-2">
                  {canWriteCourses && (
                    <button onClick={() => handleEdit(course.id)}>Sửa</button>
                  )}
                  {canDeleteCourses && (
                    <button onClick={() => handleDelete(course.id)}>Xóa</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAdmin && (
          <div className="mt-6">
            <h2>Admin Tools</h2>
            {/* Admin-specific content */}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

## 🎉 Summary

The permission system is now integrated with your existing authentication:

1. **Enhanced `AuthContext`** with permission support
2. **Permission constants** in `types/permissions.ts`
3. **Helper hooks** for easy permission checking
4. **Protected components** for conditional rendering
5. **Works seamlessly** with existing login/logout flow

All permission data is automatically fetched from `/api/users/me` when user logs in or page refreshes!
