import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGetCourseRequestById } from '@/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { CourseRequestForm } from '@/features/course-request-form'
import { DoctorFeedbackAlert } from '@/features/course-request-detail/components/doctor-feedback-alert'

function CourseRequestEditPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: request, isLoading } = useGetCourseRequestById(Number(id))

  // Redirect APPROVED requests to read-only detail
  useEffect(() => {
    if (request && request.status === 'APPROVED') {
      navigate({ to: '/course-requests/$id', params: { id }, replace: true })
    }
  }, [request, id, navigate])

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

  if (request.status === 'APPROVED') {
    return null
  }

  const feedbackAlert =
    request.doctorNotes ? (
      <DoctorFeedbackAlert
        doctorNotes={request.doctorNotes}
        reviewedAt={request.reviewedAt}
        doctorName={request.doctorName}
      />
    ) : undefined

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Chỉnh sửa yêu cầu khóa tập</h2>
          <p className='text-muted-foreground'>
            Cập nhật thông tin và nộp lại yêu cầu cho bác sĩ xét duyệt.
          </p>
        </div>
        <CourseRequestForm
          existingRequest={request}
          requestId={Number(id)}
          feedbackAlert={feedbackAlert}
        />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/course-requests/$id/edit')({
  component: CourseRequestEditPage,
})
