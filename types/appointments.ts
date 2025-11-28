/**
 * Additional TypeScript types for appointments
 * Note: Main types are auto-generated from OpenAPI in /api/types/
 */

export type AppointmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type AppointmentType = 'IN_PERSON' | 'ONLINE';
export type ScheduleExceptionType = 'UNAVAILABLE' | 'CUSTOM_HOURS';

/**
 * Status color mapping for UI display
 */
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: 'amber',
  APPROVED: 'blue',
  COMPLETED: 'green',
  REJECTED: 'red',
  CANCELLED: 'gray',
};

/**
 * Status labels for Vietnamese
 */
export const APPOINTMENT_STATUS_LABELS_VI: Record<AppointmentStatus, string> = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  COMPLETED: 'Hoàn thành',
  REJECTED: 'Đã từ chối',
  CANCELLED: 'Đã hủy',
};

/**
 * Status labels for English
 */
export const APPOINTMENT_STATUS_LABELS_EN: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

/**
 * Type labels for Vietnamese
 */
export const APPOINTMENT_TYPE_LABELS_VI: Record<AppointmentType, string> = {
  IN_PERSON: 'Trực tiếp',
  ONLINE: 'Trực tuyến',
};

/**
 * Type labels for English
 */
export const APPOINTMENT_TYPE_LABELS_EN: Record<AppointmentType, string> = {
  IN_PERSON: 'In-Person',
  ONLINE: 'Online',
};

/**
 * Days of week labels (0 = Sunday)
 */
export const DAYS_OF_WEEK_VI = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
];

export const DAYS_OF_WEEK_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Calendar view types
 */
export type CalendarView = 'month' | 'week' | 'day';

/**
 * Filter options for appointments
 */
export interface AppointmentFilters {
  status?: AppointmentStatus | 'all';
  type?: AppointmentType | 'all';
  doctorId?: number;
  searchTerm?: string;
}
