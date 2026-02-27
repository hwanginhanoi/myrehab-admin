import type { CourseAssignmentRequestResponse } from '@/api'

export type CourseRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type CourseRequest = CourseAssignmentRequestResponse

export type ParsedCourseDetails = {
  courseName?: string
  description?: string
  durationDays?: number
  days?: Array<{
    dayNumber: number
    exercises: Array<{
      exerciseId: number
      repetitions: number
      sets: number
    }>
  }>
}

export function parseCourseDetails(courseDetails?: {
  [key: string]: object
}): ParsedCourseDetails {
  if (!courseDetails) return {}
  return courseDetails as unknown as ParsedCourseDetails
}
