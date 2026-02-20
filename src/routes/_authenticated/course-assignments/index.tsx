import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CourseAssignments } from '@/features/course-assignments'

const courseAssignmentsSearchSchema = z.object({
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  patientName: z.string().optional().catch(''),
  courseId: z.coerce.number().optional().catch(undefined),
  doctorId: z.coerce.number().optional().catch(undefined),
  purchaseStatus: z.array(z.string()).optional().catch([]),
  includeRevoked: z.boolean().optional().catch(false),
  startDate: z.string().optional().catch(undefined),
  endDate: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/course-assignments/')({
  validateSearch: courseAssignmentsSearchSchema,
  component: CourseAssignments,
})
