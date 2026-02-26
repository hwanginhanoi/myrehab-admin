import { createFileRoute, useLocation } from '@tanstack/react-router'
import type { CourseAssignmentRequestResponse } from '@/api'
import { DoctorCourseRequestDetail } from '@/features/doctor-course-request-detail'

function DoctorCourseRequestDetailPage() {
  const location = useLocation()
  const state = location.state as { requestData?: CourseAssignmentRequestResponse } | undefined
  const request = state?.requestData

  if (!request) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <span className='text-muted-foreground'>
          Không tìm thấy dữ liệu yêu cầu. Vui lòng quay lại danh sách.
        </span>
      </div>
    )
  }

  return <DoctorCourseRequestDetail request={request} />
}

export const Route = createFileRoute('/_authenticated/doctor-course-requests/$id')({
  component: DoctorCourseRequestDetailPage,
})
