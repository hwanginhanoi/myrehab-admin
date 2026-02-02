// Permission category structure
export type Permission = {
  id: string
  label: string
}

export type PermissionCategory = {
  id: string
  title: string
  description: string
  permissions: Permission[]
}

// All available permissions in the system
export const ALL_PERMISSIONS = {
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',

  // Staff Management
  STAFF_VIEW: 'staff:view',
  STAFF_CREATE: 'staff:create',
  STAFF_UPDATE: 'staff:update',
  STAFF_ENABLE: 'staff:enable',
  STAFF_DISABLE: 'staff:disable',
  STAFF_ASSIGN_TRAINER: 'staff:assign_trainer',
  STAFF_ASSIGN_GROUPS: 'staff:assign_groups',

  // Patient Management
  PATIENTS_VIEW: 'patients:view',
  PATIENTS_VIEW_DETAILS: 'patients:view_details',
  PATIENTS_VIEW_COURSES: 'patients:view_courses',
  PATIENTS_ASSIGN_DOCTOR: 'patients:assign_doctor',
  PATIENTS_REMOVE_DOCTOR: 'patients:remove_doctor',

  // Exercises
  EXERCISES_VIEW: 'exercises:view',
  EXERCISES_CREATE: 'exercises:create',
  EXERCISES_UPDATE: 'exercises:update',

  // Exercise Groups
  EXERCISE_GROUPS_VIEW: 'exercise_groups:view',
  EXERCISE_GROUPS_CREATE: 'exercise_groups:create',
  EXERCISE_GROUPS_UPDATE: 'exercise_groups:update',

  // Categories
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',

  // Packages
  PACKAGES_VIEW: 'packages:view',
  PACKAGES_CREATE: 'packages:create',
  PACKAGES_UPDATE: 'packages:update',

  // Courses
  COURSES_VIEW: 'courses:view',
  COURSES_CREATE: 'courses:create',
  COURSES_UPDATE: 'courses:update',
  COURSES_ASSIGN: 'courses:assign',
  COURSES_REVOKE: 'courses:revoke',

  // Progress Tracking
  COURSE_PROGRESS_VIEW: 'course_progress:view',
  COURSE_PROGRESS_MANAGE: 'course_progress:manage',

  // Balance & Transactions
  BALANCE_VIEW: 'balance:view',
  BALANCE_ADD: 'balance:add',
  TRANSACTIONS_VIEW: 'transactions:view',
  TRANSACTIONS_VIEW_ALL: 'transactions:view_all',

  // Subscriptions
  SUBSCRIPTIONS_VIEW: 'subscriptions:view',
  SUBSCRIPTIONS_VIEW_ALL: 'subscriptions:view_all',
  SUBSCRIPTIONS_MANAGE: 'subscriptions:manage',

  // News
  NEWS_VIEW: 'news:view',
  NEWS_CREATE: 'news:create',
  NEWS_UPDATE: 'news:update',

  // File Management
  FILES_UPLOAD: 'files:upload',
  FILES_DOWNLOAD: 'files:download',
  FILES_DELETE: 'files:delete',

  // Rehabilitation Forms
  REHAB_FORMS_VIEW: 'rehab_forms:view',
  REHAB_FORMS_CREATE: 'rehab_forms:create',
  REHAB_FORMS_UPDATE: 'rehab_forms:update',
} as const

// Doctor permission categories
export const DOCTOR_PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'patients',
    title: 'Quản lý Bệnh nhân',
    description: 'Quyền xem và quản lý thông tin bệnh nhân',
    permissions: [
      { id: ALL_PERMISSIONS.PATIENTS_VIEW, label: 'Xem danh sách bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_VIEW_DETAILS, label: 'Xem chi tiết bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_VIEW_COURSES, label: 'Xem khóa học của bệnh nhân' },
    ],
  },
  {
    id: 'exercises',
    title: 'Bài tập & Nhóm bài tập',
    description: 'Quyền xem bài tập và nhóm bài tập',
    permissions: [
      { id: ALL_PERMISSIONS.EXERCISES_VIEW, label: 'Xem danh sách bài tập' },
      { id: ALL_PERMISSIONS.EXERCISE_GROUPS_VIEW, label: 'Xem nhóm bài tập' },
      { id: ALL_PERMISSIONS.CATEGORIES_VIEW, label: 'Xem danh mục' },
    ],
  },
  {
    id: 'courses',
    title: 'Quản lý Khóa học & Gói tập',
    description: 'Quyền quản lý khóa học và gói tập',
    permissions: [
      { id: ALL_PERMISSIONS.PACKAGES_VIEW, label: 'Xem gói tập' },
      { id: ALL_PERMISSIONS.COURSES_VIEW, label: 'Xem khóa học' },
      { id: ALL_PERMISSIONS.COURSES_CREATE, label: 'Tạo khóa học' },
      { id: ALL_PERMISSIONS.COURSES_ASSIGN, label: 'Gán khóa học' },
      { id: ALL_PERMISSIONS.COURSES_REVOKE, label: 'Thu hồi khóa học' },
    ],
  },
  {
    id: 'progress',
    title: 'Theo dõi Tiến trình',
    description: 'Quyền xem tiến trình của bệnh nhân',
    permissions: [
      { id: ALL_PERMISSIONS.COURSE_PROGRESS_VIEW, label: 'Xem tiến trình khóa học' },
    ],
  },
  {
    id: 'files',
    title: 'Quản lý File',
    description: 'Quyền quản lý file và tài liệu',
    permissions: [
      { id: ALL_PERMISSIONS.FILES_UPLOAD, label: 'Tải lên file' },
    ],
  },
  {
    id: 'rehab_forms',
    title: 'Phiếu Khám PHCN',
    description: 'Quyền quản lý phiếu khám phục hồi chức năng',
    permissions: [
      { id: ALL_PERMISSIONS.REHAB_FORMS_VIEW, label: 'Xem phiếu khám' },
      { id: ALL_PERMISSIONS.REHAB_FORMS_CREATE, label: 'Tạo phiếu khám' },
      { id: ALL_PERMISSIONS.REHAB_FORMS_UPDATE, label: 'Cập nhật phiếu khám' },
    ],
  },
]

// Trainer permission categories
export const TRAINER_PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'patients',
    title: 'Quản lý Bệnh nhân',
    description: 'Quyền xem thông tin bệnh nhân',
    permissions: [
      { id: ALL_PERMISSIONS.PATIENTS_VIEW, label: 'Xem danh sách bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_VIEW_DETAILS, label: 'Xem chi tiết bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_VIEW_COURSES, label: 'Xem khóa học của bệnh nhân' },
    ],
  },
  {
    id: 'exercises',
    title: 'Quản lý Bài tập',
    description: 'Quyền quản lý bài tập',
    permissions: [
      { id: ALL_PERMISSIONS.EXERCISES_VIEW, label: 'Xem danh sách bài tập' },
    ],
  },
  {
    id: 'categories',
    title: 'Quản lý Danh mục',
    description: 'Quyền quản lý danh mục',
    permissions: [
      { id: ALL_PERMISSIONS.CATEGORIES_VIEW, label: 'Xem danh mục' },
      { id: ALL_PERMISSIONS.CATEGORIES_CREATE, label: 'Tạo danh mục' },
      { id: ALL_PERMISSIONS.CATEGORIES_UPDATE, label: 'Cập nhật danh mục' },
    ],
  },
  {
    id: 'packages',
    title: 'Quản lý Gói tập',
    description: 'Quyền quản lý gói tập',
    permissions: [
      { id: ALL_PERMISSIONS.PACKAGES_VIEW, label: 'Xem gói tập' },
      { id: ALL_PERMISSIONS.PACKAGES_CREATE, label: 'Tạo gói tập' },
      { id: ALL_PERMISSIONS.PACKAGES_UPDATE, label: 'Cập nhật gói tập' },
    ],
  },
  {
    id: 'courses',
    title: 'Quản lý Khóa học',
    description: 'Quyền quản lý khóa học',
    permissions: [
      { id: ALL_PERMISSIONS.COURSES_VIEW, label: 'Xem khóa học' },
      { id: ALL_PERMISSIONS.COURSES_CREATE, label: 'Tạo khóa học' },
      { id: ALL_PERMISSIONS.COURSES_UPDATE, label: 'Cập nhật khóa học' },
    ],
  },
  {
    id: 'progress',
    title: 'Theo dõi Tiến trình',
    description: 'Quyền quản lý tiến trình',
    permissions: [
      { id: ALL_PERMISSIONS.COURSE_PROGRESS_VIEW, label: 'Xem tiến trình khóa học' },
      { id: ALL_PERMISSIONS.COURSE_PROGRESS_MANAGE, label: 'Quản lý tiến trình' },
    ],
  },
  {
    id: 'files',
    title: 'Quản lý File',
    description: 'Quyền tải xuống file',
    permissions: [
      { id: ALL_PERMISSIONS.FILES_DOWNLOAD, label: 'Tải xuống file' },
    ],
  },
  {
    id: 'rehab_forms',
    title: 'Phiếu Khám PHCN',
    description: 'Quyền quản lý phiếu khám phục hồi chức năng',
    permissions: [
      { id: ALL_PERMISSIONS.REHAB_FORMS_VIEW, label: 'Xem phiếu khám' },
      { id: ALL_PERMISSIONS.REHAB_FORMS_CREATE, label: 'Tạo phiếu khám' },
      { id: ALL_PERMISSIONS.REHAB_FORMS_UPDATE, label: 'Cập nhật phiếu khám' },
    ],
  },
]

// Admin permission categories (full access)
export const ADMIN_PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'users',
    title: 'Quản lý Người dùng',
    description: 'Quyền quản lý tài khoản người dùng',
    permissions: [
      { id: ALL_PERMISSIONS.USERS_VIEW, label: 'Xem người dùng' },
      { id: ALL_PERMISSIONS.USERS_CREATE, label: 'Tạo người dùng' },
      { id: ALL_PERMISSIONS.USERS_UPDATE, label: 'Cập nhật người dùng' },
    ],
  },
  {
    id: 'staff',
    title: 'Quản lý Nhân viên',
    description: 'Quyền quản lý bác sĩ và huấn luyện viên',
    permissions: [
      { id: ALL_PERMISSIONS.STAFF_VIEW, label: 'Xem nhân viên' },
      { id: ALL_PERMISSIONS.STAFF_CREATE, label: 'Tạo nhân viên' },
      { id: ALL_PERMISSIONS.STAFF_UPDATE, label: 'Cập nhật nhân viên' },
      { id: ALL_PERMISSIONS.STAFF_ENABLE, label: 'Kích hoạt nhân viên' },
      { id: ALL_PERMISSIONS.STAFF_DISABLE, label: 'Vô hiệu hóa nhân viên' },
      { id: ALL_PERMISSIONS.STAFF_ASSIGN_TRAINER, label: 'Gán huấn luyện viên' },
      { id: ALL_PERMISSIONS.STAFF_ASSIGN_GROUPS, label: 'Gán nhóm' },
    ],
  },
  {
    id: 'patients',
    title: 'Quản lý Bệnh nhân',
    description: 'Quyền quản lý thông tin bệnh nhân',
    permissions: [
      { id: ALL_PERMISSIONS.PATIENTS_VIEW, label: 'Xem danh sách bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_VIEW_DETAILS, label: 'Xem chi tiết bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_VIEW_COURSES, label: 'Xem khóa học của bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_ASSIGN_DOCTOR, label: 'Gán bác sĩ cho bệnh nhân' },
      { id: ALL_PERMISSIONS.PATIENTS_REMOVE_DOCTOR, label: 'Xóa bác sĩ khỏi bệnh nhân' },
    ],
  },
  {
    id: 'exercises',
    title: 'Quản lý Bài tập',
    description: 'Quyền quản lý bài tập',
    permissions: [
      { id: ALL_PERMISSIONS.EXERCISES_VIEW, label: 'Xem danh sách bài tập' },
      { id: ALL_PERMISSIONS.EXERCISES_CREATE, label: 'Tạo bài tập' },
      { id: ALL_PERMISSIONS.EXERCISES_UPDATE, label: 'Cập nhật bài tập' },
    ],
  },
  {
    id: 'exercise_groups',
    title: 'Quản lý Nhóm bài tập',
    description: 'Quyền quản lý nhóm bài tập',
    permissions: [
      { id: ALL_PERMISSIONS.EXERCISE_GROUPS_VIEW, label: 'Xem nhóm bài tập' },
      { id: ALL_PERMISSIONS.EXERCISE_GROUPS_CREATE, label: 'Tạo nhóm bài tập' },
      { id: ALL_PERMISSIONS.EXERCISE_GROUPS_UPDATE, label: 'Cập nhật nhóm bài tập' },
    ],
  },
  {
    id: 'categories',
    title: 'Quản lý Danh mục',
    description: 'Quyền quản lý danh mục',
    permissions: [
      { id: ALL_PERMISSIONS.CATEGORIES_VIEW, label: 'Xem danh mục' },
      { id: ALL_PERMISSIONS.CATEGORIES_CREATE, label: 'Tạo danh mục' },
      { id: ALL_PERMISSIONS.CATEGORIES_UPDATE, label: 'Cập nhật danh mục' },
    ],
  },
  {
    id: 'packages',
    title: 'Quản lý Gói tập',
    description: 'Quyền quản lý gói tập',
    permissions: [
      { id: ALL_PERMISSIONS.PACKAGES_VIEW, label: 'Xem gói tập' },
      { id: ALL_PERMISSIONS.PACKAGES_CREATE, label: 'Tạo gói tập' },
      { id: ALL_PERMISSIONS.PACKAGES_UPDATE, label: 'Cập nhật gói tập' },
    ],
  },
  {
    id: 'courses',
    title: 'Quản lý Khóa học',
    description: 'Quyền quản lý khóa học',
    permissions: [
      { id: ALL_PERMISSIONS.COURSES_VIEW, label: 'Xem khóa học' },
      { id: ALL_PERMISSIONS.COURSES_CREATE, label: 'Tạo khóa học' },
      { id: ALL_PERMISSIONS.COURSES_UPDATE, label: 'Cập nhật khóa học' },
      { id: ALL_PERMISSIONS.COURSES_ASSIGN, label: 'Gán khóa học' },
      { id: ALL_PERMISSIONS.COURSES_REVOKE, label: 'Thu hồi khóa học' },
    ],
  },
  {
    id: 'progress',
    title: 'Theo dõi Tiến trình',
    description: 'Quyền quản lý tiến trình',
    permissions: [
      { id: ALL_PERMISSIONS.COURSE_PROGRESS_VIEW, label: 'Xem tiến trình khóa học' },
      { id: ALL_PERMISSIONS.COURSE_PROGRESS_MANAGE, label: 'Quản lý tiến trình' },
    ],
  },
  {
    id: 'balance',
    title: 'Quản lý Số dư & Giao dịch',
    description: 'Quyền quản lý số dư và giao dịch',
    permissions: [
      { id: ALL_PERMISSIONS.BALANCE_VIEW, label: 'Xem số dư' },
      { id: ALL_PERMISSIONS.BALANCE_ADD, label: 'Nạp tiền' },
      { id: ALL_PERMISSIONS.TRANSACTIONS_VIEW, label: 'Xem giao dịch' },
      { id: ALL_PERMISSIONS.TRANSACTIONS_VIEW_ALL, label: 'Xem tất cả giao dịch' },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Quản lý Đăng ký',
    description: 'Quyền quản lý đăng ký',
    permissions: [
      { id: ALL_PERMISSIONS.SUBSCRIPTIONS_VIEW, label: 'Xem đăng ký' },
      { id: ALL_PERMISSIONS.SUBSCRIPTIONS_VIEW_ALL, label: 'Xem tất cả đăng ký' },
      { id: ALL_PERMISSIONS.SUBSCRIPTIONS_MANAGE, label: 'Quản lý đăng ký' },
    ],
  },
  {
    id: 'news',
    title: 'Quản lý Tin tức',
    description: 'Quyền quản lý tin tức',
    permissions: [
      { id: ALL_PERMISSIONS.NEWS_VIEW, label: 'Xem tin tức' },
      { id: ALL_PERMISSIONS.NEWS_CREATE, label: 'Tạo tin tức' },
      { id: ALL_PERMISSIONS.NEWS_UPDATE, label: 'Cập nhật tin tức' },
    ],
  },
  {
    id: 'files',
    title: 'Quản lý File',
    description: 'Quyền quản lý file và tài liệu',
    permissions: [
      { id: ALL_PERMISSIONS.FILES_UPLOAD, label: 'Tải lên file' },
      { id: ALL_PERMISSIONS.FILES_DOWNLOAD, label: 'Tải xuống file' },
      { id: ALL_PERMISSIONS.FILES_DELETE, label: 'Xóa file' },
    ],
  },
  {
    id: 'rehab_forms',
    title: 'Phiếu Khám PHCN',
    description: 'Quyền quản lý phiếu khám phục hồi chức năng',
    permissions: [
      { id: ALL_PERMISSIONS.REHAB_FORMS_VIEW, label: 'Xem phiếu khám' },
      { id: ALL_PERMISSIONS.REHAB_FORMS_CREATE, label: 'Tạo phiếu khám' },
      { id: ALL_PERMISSIONS.REHAB_FORMS_UPDATE, label: 'Cập nhật phiếu khám' },
    ],
  },
]

// Permissions that are always enabled and cannot be deactivated per staff type
export const REQUIRED_PERMISSIONS: Record<string, string[]> = {
  DOCTOR: [ALL_PERMISSIONS.EXERCISES_VIEW],
  TRAINER: [ALL_PERMISSIONS.EXERCISES_VIEW],
}

// Helper to get required (locked) permissions by staff type
export function getRequiredPermissionsByStaffType(staffType: string): string[] {
  return REQUIRED_PERMISSIONS[staffType] || []
}

// Helper to get permission categories by staff type
export function getPermissionCategoriesByStaffType(staffType: string): PermissionCategory[] {
  switch (staffType) {
    case 'DOCTOR':
      return DOCTOR_PERMISSION_CATEGORIES
    case 'TRAINER':
      return TRAINER_PERMISSION_CATEGORIES
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return ADMIN_PERMISSION_CATEGORIES
    default:
      return []
  }
}
