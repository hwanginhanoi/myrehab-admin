import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CourseAssignmentDetail } from '@/features/course-assignment-detail'

const courseAssignmentDetailSearchSchema = z.object({
  courseId: z.coerce.number(),
  courseTitle: z.string().optional().catch(undefined),
  patientFullName: z.string().optional().catch(undefined),
  assignedByDoctorName: z.string().optional().catch(undefined),
  assignedAt: z.string().optional().catch(undefined),
  purchaseStatus: z
    .enum(['PENDING_PURCHASE', 'PURCHASED', 'EXPIRED'])
    .optional()
    .catch(undefined),
  hasStarted: z.coerce.boolean().optional().catch(undefined),
  isCompleted: z.coerce.boolean().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/course-assignments/$id')({
  validateSearch: courseAssignmentDetailSearchSchema,
  component: CourseAssignmentDetail,
})
