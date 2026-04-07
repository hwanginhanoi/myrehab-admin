export type AuditLogAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'STATUS_CHANGE'
  | 'ASSIGN'
  | 'REVOKE'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'ACCOUNT_LOCKED'
  | 'PIN_CHANGE'
  | 'PROFILE_UPDATE'

export type AuditLogEntityType =
  | 'STAFF'
  | 'USER'
  | 'EXERCISE'
  | 'EXERCISE_GROUP'
  | 'EXERCISE_CATEGORY'
  | 'EXERCISE_PACKAGE'
  | 'APPOINTMENT'
  | 'COURSE'
  | 'COURSE_ASSIGNMENT'
  | 'BANNER'
  | 'NEWS'
  | 'DISCOUNT'
  | 'BALANCE'
  | 'REHAB_FORM'
  | 'STARTUP_POPUP'
  | 'FILE'
  | 'CLINIC_SCHEDULE'
  | 'DOCTOR_PATIENT'

export type AuditLogRecord = {
  id: number
  action: AuditLogAction
  entityType: AuditLogEntityType
  entityId: number
  actorId: number
  actorType: 'STAFF' | 'USER'
  actorName: string
  description: string
  details: string | null
  ipAddress: string | null
  createdAt: string
}

export type AuditLogPageResponse = {
  content: AuditLogRecord[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export const ACTION_LABELS: Record<AuditLogAction, { label: string; color: string }> = {
  CREATE: { label: 'Tạo mới', color: 'bg-green-500/15 text-green-700 dark:text-green-400' },
  UPDATE: { label: 'Cập nhật', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400' },
  DELETE: { label: 'Xóa', color: 'bg-red-500/15 text-red-700 dark:text-red-400' },
  STATUS_CHANGE: { label: 'Thay đổi trạng thái', color: 'bg-orange-500/15 text-orange-700 dark:text-orange-400' },
  ASSIGN: { label: 'Phân công', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-400' },
  REVOKE: { label: 'Thu hồi', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-400' },
  LOGIN_SUCCESS: { label: 'Đăng nhập thành công', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  LOGIN_FAILURE: { label: 'Đăng nhập thất bại', color: 'bg-red-500/15 text-red-700 dark:text-red-400' },
  ACCOUNT_LOCKED: { label: 'Khóa tài khoản', color: 'bg-red-700/15 text-red-900 dark:text-red-300' },
  PIN_CHANGE: { label: 'Đổi PIN', color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
  PROFILE_UPDATE: { label: 'Cập nhật hồ sơ', color: 'bg-sky-500/15 text-sky-700 dark:text-sky-400' },
}

export const ENTITY_TYPE_LABELS: Record<AuditLogEntityType, string> = {
  STAFF: 'Nhân viên',
  USER: 'Bệnh nhân',
  EXERCISE: 'Bài tập',
  EXERCISE_GROUP: 'Nhóm bài tập',
  EXERCISE_CATEGORY: 'Danh mục',
  EXERCISE_PACKAGE: 'Gói bài tập',
  APPOINTMENT: 'Lịch hẹn',
  COURSE: 'Khóa học',
  COURSE_ASSIGNMENT: 'Phân công khóa học',
  BANNER: 'Banner',
  NEWS: 'Tin tức',
  DISCOUNT: 'Giảm giá',
  BALANCE: 'Số dư',
  REHAB_FORM: 'Phiếu khám PHCN',
  STARTUP_POPUP: 'Popup khởi động',
  FILE: 'Tệp tin',
  CLINIC_SCHEDULE: 'Lịch phòng khám',
  DOCTOR_PATIENT: 'Bệnh nhân phụ trách',
}

export const SECURITY_ACTIONS: AuditLogAction[] = ['LOGIN_FAILURE', 'ACCOUNT_LOCKED']
