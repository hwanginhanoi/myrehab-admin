import { createFileRoute } from '@tanstack/react-router'
import { useGetCourseRequestById } from '@/api'
import { CourseRequestDetail } from '@/features/course-request-detail'

function CourseRequestDetailPage() {
  const { id } = Route.useParams()
  const { data: request, isLoading } = useGetCourseRequestById(Number(id))

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <span className='text-muted-foreground'>Đang tải...</span>
      </div>
    )
  }

  if (!request) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <span className='text-muted-foreground'>Không tìm thấy yêu cầu.</span>
      </div>
    )
  }

  return <CourseRequestDetail request={request} />
}

export const Route = createFileRoute('/_authenticated/course-requests/$id/')({
  component: CourseRequestDetailPage,
})
