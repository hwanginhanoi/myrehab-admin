import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CourseRequests } from '@/features/course-requests'

const courseRequestsSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  pageSize: z.coerce.number().catch(10),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/course-requests/')({
  validateSearch: courseRequestsSearchSchema,
  component: CourseRequests,
})
