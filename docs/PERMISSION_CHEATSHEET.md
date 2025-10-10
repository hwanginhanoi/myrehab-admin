# Permission System - Quick Reference

## 🎯 Import

```typescript
import { useAuth } from '@/contexts/auth-context';
import { usePermissions } from '@/hooks/usePermissions';
import { ProtectedAction } from '@/components/ProtectedAction';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/types/permissions';
```

## 🔑 Permission Constants

```typescript
// Course Management
PERMISSIONS.COURSE_READ
PERMISSIONS.COURSE_WRITE
PERMISSIONS.COURSE_DELETE

// Exercise Management
PERMISSIONS.EXERCISE_READ
PERMISSIONS.EXERCISE_WRITE
PERMISSIONS.EXERCISE_DELETE

// Category Management
PERMISSIONS.CATEGORY_READ
PERMISSIONS.CATEGORY_WRITE
PERMISSIONS.CATEGORY_DELETE

// Patient Management
PERMISSIONS.PATIENT_VIEW
PERMISSIONS.PATIENT_ASSIGN_COURSE
PERMISSIONS.PATIENT_VIEW_HISTORY

// User Management
PERMISSIONS.USER_READ
PERMISSIONS.USER_WRITE
PERMISSIONS.USER_DELETE

// Doctor Management
PERMISSIONS.DOCTOR_READ
PERMISSIONS.DOCTOR_WRITE
PERMISSIONS.DOCTOR_DELETE

// Admin Management
PERMISSIONS.ADMIN_READ
PERMISSIONS.ADMIN_WRITE
PERMISSIONS.ADMIN_DELETE

// Purchase Management
PERMISSIONS.PURCHASE_VIEW
PERMISSIONS.PURCHASE_MANAGE

// Permission Management
PERMISSIONS.PERMISSION_READ
PERMISSIONS.PERMISSION_WRITE
```

## 🪝 useAuth Hook

```typescript
const {
  user,                 // Current user object
  token,                // Auth token
  login,                // Login function
  logout,               // Logout function
  isAuthenticated,      // Boolean
  isLoading,            // Boolean
  hasPermission,        // (permission: string) => boolean
  hasAnyPermission,     // (permissions: string[]) => boolean
  hasAllPermissions,    // (permissions: string[]) => boolean
  hasRole,              // (role: 'ADMIN' | 'DOCTOR') => boolean
  refreshUser,          // () => Promise<void>
} = useAuth();
```

### Examples

```typescript
// Check single permission
if (hasPermission(PERMISSIONS.COURSE_WRITE)) {
  // Show create button
}

// Check multiple permissions (any)
if (hasAnyPermission([PERMISSIONS.COURSE_READ, PERMISSIONS.EXERCISE_READ])) {
  // Show view panel
}

// Check role
if (hasRole('ADMIN')) {
  // Show admin panel
}
```

## 🎨 usePermissions Hook

```typescript
const {
  // Course
  canReadCourses,
  canWriteCourses,
  canDeleteCourses,
  canManageCourses,

  // Exercise
  canReadExercises,
  canWriteExercises,
  canDeleteExercises,
  canManageExercises,

  // Category
  canReadCategories,
  canWriteCategories,
  canDeleteCategories,
  canManageCategories,

  // Patient
  canViewPatients,
  canAssignCourseToPatient,
  canViewPatientHistory,
  canManagePatients,

  // User
  canReadUsers,
  canWriteUsers,
  canDeleteUsers,
  canManageUsers,

  // Roles
  isAdmin,
  isDoctor,
} = usePermissions();
```

### Examples

```typescript
if (canWriteCourses) {
  // Show create course button
}

if (isAdmin) {
  // Show admin settings
}
```

## 🛡️ ProtectedAction Component

### Single Permission

```typescript
<ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>
  <button>Create Course</button>
</ProtectedAction>
```

### Multiple Permissions (Any)

```typescript
<ProtectedAction anyPermissions={[
  PERMISSIONS.COURSE_READ,
  PERMISSIONS.EXERCISE_READ
]}>
  <ViewPanel />
</ProtectedAction>
```

### Multiple Permissions (All)

```typescript
<ProtectedAction allPermissions={[
  PERMISSIONS.COURSE_WRITE,
  PERMISSIONS.CATEGORY_WRITE
]}>
  <AdvancedEditor />
</ProtectedAction>
```

### Role-Based

```typescript
<ProtectedAction role="ADMIN">
  <AdminSettings />
</ProtectedAction>
```

### With Fallback

```typescript
<ProtectedAction
  permission={PERMISSIONS.COURSE_DELETE}
  fallback={<button disabled>Delete (No Permission)</button>}
>
  <button variant="destructive">Delete</button>
</ProtectedAction>
```

### With Loading

```typescript
<ProtectedAction
  permission={PERMISSIONS.COURSE_READ}
  showLoading
  loadingFallback={<Skeleton />}
>
  <CourseList />
</ProtectedAction>
```

## 🔒 ProtectedRoute Component

### Single Permission

```typescript
export default function CoursesPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.COURSE_READ}>
      <CourseList />
    </ProtectedRoute>
  );
}
```

### Role-Based

```typescript
export default function AdminPage() {
  return (
    <ProtectedRoute role="ADMIN">
      <AdminPanel />
    </ProtectedRoute>
  );
}
```

### Custom Redirect

```typescript
<ProtectedRoute
  permission={PERMISSIONS.COURSE_WRITE}
  redirectTo="/dashboard"
>
  <CreateCourse />
</ProtectedRoute>
```

### Multiple Permissions

```typescript
<ProtectedRoute
  allPermissions={[
    PERMISSIONS.PERMISSION_READ,
    PERMISSIONS.PERMISSION_WRITE
  ]}
>
  <PermissionManagement />
</ProtectedRoute>
```

## 📋 Common Patterns

### Navigation Menu

```typescript
const { canManageCourses, canManageExercises, isAdmin } = usePermissions();

<nav>
  {canManageCourses && <Link href="/courses">Courses</Link>}
  {canManageExercises && <Link href="/exercises">Exercises</Link>}
  {isAdmin && <Link href="/settings">Settings</Link>}
</nav>
```

### Table Row Actions

```typescript
<ProtectedAction permission={PERMISSIONS.COURSE_WRITE}>
  <button onClick={() => handleEdit(id)}>Edit</button>
</ProtectedAction>

<ProtectedAction permission={PERMISSIONS.COURSE_DELETE}>
  <button onClick={() => handleDelete(id)}>Delete</button>
</ProtectedAction>
```

### Form Fields

```typescript
<form>
  <input name="name" />
  <textarea name="description" />

  <ProtectedAction role="ADMIN">
    <input name="priority" type="number" />
  </ProtectedAction>

  <button type="submit">Save</button>
</form>
```

### Conditional Logic

```typescript
const { hasPermission } = useAuth();

async function handleAction() {
  if (hasPermission(PERMISSIONS.COURSE_WRITE)) {
    await updateCourse();
  }

  if (hasPermission(PERMISSIONS.COURSE_DELETE)) {
    await deleteCourse();
  }
}
```

## 🔌 API Calls

### Get All Permissions

```typescript
import { getAllPermissions } from '@/api/api/permissionManagementController';

const permissions = await getAllPermissions();
// Returns: string[]
```

### Get User Permissions

```typescript
import { getCurrentUser } from '@/api/api/userManagementController';

const user = await getCurrentUser();
// Returns: { id, email, fullName, role, permissions[], phoneNumber }
```

### Manage Admin Permissions

```typescript
import {
  getAdminPermissions,
  setAdminPermissions,
  assignPermissionToAdmin,
  removePermissionFromAdmin
} from '@/api/api/permissionManagementController';

// Get
const perms = await getAdminPermissions({ adminId: 123 });

// Set all
await setAdminPermissions({
  adminId: 123,
  data: { permissions: ['course:read', 'course:write'] }
});

// Add one
await assignPermissionToAdmin({
  adminId: 123,
  data: { permission: 'course:delete' }
});

// Remove one
await removePermissionFromAdmin({
  adminId: 123,
  permission: 'course:delete'
});
```

### Manage Doctor Permissions

```typescript
import {
  getDoctorPermissions,
  setDoctorPermissions,
  assignPermissionToDoctor,
  removePermissionFromDoctor
} from '@/api/api/permissionManagementController';

// Same API as admin permissions
```

## ✅ Best Practices

1. **Always use constants**
   ```typescript
   // Good ✅
   hasPermission(PERMISSIONS.COURSE_WRITE)

   // Bad ❌
   hasPermission('course:write')
   ```

2. **Provide fallbacks**
   ```typescript
   <ProtectedAction
     permission={PERMISSIONS.COURSE_DELETE}
     fallback={<span>No permission</span>}
   >
     <button>Delete</button>
   </ProtectedAction>
   ```

3. **Handle loading**
   ```typescript
   const { user, isLoading } = useAuth();

   if (isLoading) return <Loading />;
   if (!user) return <Login />;
   ```

4. **Backend validation**
   - Frontend checks are for UX only
   - Always validate on backend

## 🐛 Troubleshooting

```typescript
// Check if permissions loaded
const { user } = useAuth();
console.log('User permissions:', user?.permissions);

// Manually refresh user data
const { refreshUser } = useAuth();
await refreshUser();

// Check localStorage
console.log('Token:', localStorage.getItem('authToken'));
console.log('User:', localStorage.getItem('userData'));
```

## 📚 Documentation

- `PERMISSION_USAGE.md` - Full usage guide
- `PERMISSION_SUMMARY.md` - Implementation summary
- `PERMISSIONS_GUIDE.md` - Complete API docs
- `PERMISSIONS_EXAMPLES.md` - Code examples

---

**Quick tip**: Use `usePermissions()` for boolean checks, `<ProtectedAction>` for UI elements!
