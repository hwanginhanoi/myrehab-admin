import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { DoctorCourseRequests } from '@/features/doctor-course-requests'

const doctorCourseRequestsSearchSchema = z.object({
  page: z.coerce.number().catch(1),
  pageSize: z.coerce.number().catch(10),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/doctor-course-requests/')({
  validateSearch: doctorCourseRequestsSearchSchema,
  component: DoctorCourseRequests,
})
