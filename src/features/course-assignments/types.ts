// Type for course assignment detail response
// Based on backend API specification
export type CourseAssignmentDetail = {
  id?: number
  patientId?: number
  patientFullName?: string
  patientPhoneNumber?: string
  courseId?: number
  courseTitle?: string
  courseDescription?: string
  courseDurationDays?: number
  assignedByDoctorId?: number
  assignedByDoctorName?: string
  assignedByDoctorEmail?: string
  assignedAt?: string
  notes?: string
  isRevoked?: boolean
  revokedAt?: string
  purchaseStatus?: 'PENDING_PURCHASE' | 'PURCHASED' | 'EXPIRED'
  purchasedAt?: string
  hasStarted?: boolean
  isCompleted?: boolean
}
