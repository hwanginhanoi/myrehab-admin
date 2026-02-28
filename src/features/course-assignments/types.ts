// Type for course assignment detail response
// Based on backend API specification
export type CourseAssignmentDetail = {
  id?: number
  patientId?: number
  patientFullName?: string
  courseId?: number
  courseTitle?: string
  assignedByDoctorName?: string
  assignedAt?: string
  purchaseStatus?: 'PENDING_PURCHASE' | 'PURCHASED' | 'EXPIRED'
  hasStarted?: boolean
  isCompleted?: boolean
}
