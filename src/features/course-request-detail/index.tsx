import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, Pencil, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import type { CourseAssignmentRequestResponse } from '@/api'
import { CourseRequestStatusBadge } from '@/features/course-requests/components/course-request-status-badge'
import { DoctorFeedbackAlert } from './components/doctor-feedback-alert'
import { CourseDetailsReadOnly } from './components/course-details-read-only'

type CourseRequestDetailProps = {
  request: CourseAssignmentRequestResponse
}

export function CourseRequestDetail({ request }: CourseRequestDetailProps) {
  const navigate = useNavigate()

  const isRejected = request.status === 'REJECTED'
  const isApproved = request.status === 'APPROVED'
  const isPending = request.status === 'PENDING'
  const canEdit = isRejected || isPending

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {/* Header bar */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => navigate({ to: '/course-requests', search: { page: 1, pageSize: 10 } })}
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <div>
              <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold tracking-tight'>Chi tiết yêu cầu</h2>
                <CourseRequestStatusBadge status={request.status} />
              </div>
              <p className='text-muted-foreground text-sm'>
                Bệnh nhân: <span className='font-medium'>{request.patientName || '-'}</span>
                {request.createdAt && (
                  <> · Ngày tạo: {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}</>
                )}
              </p>
            </div>
          </div>
          {canEdit && (
            <Button
              onClick={() =>
                navigate({ to: '/course-requests/$id/edit', params: { id: String(request.id) } })
              }
              className='gap-2'
            >
              <Pencil className='h-4 w-4' />
              Sửa & Nộp lại
            </Button>
          )}
        </div>

        {/* Doctor feedback (REJECTED) */}
        {isRejected && request.doctorNotes && (
          <DoctorFeedbackAlert
            doctorNotes={request.doctorNotes}
            reviewedAt={request.reviewedAt}
            doctorName={request.doctorName}
          />
        )}

        {/* Approval block (APPROVED) */}
        {isApproved && (
          <Card className='border-green-500'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-green-600'>
                <CheckCircle className='h-5 w-5' />
                Đã được phê duyệt
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              {request.reviewedAt && (
                <p>
                  <span className='text-muted-foreground'>Ngày duyệt: </span>
                  {format(new Date(request.reviewedAt), 'dd/MM/yyyy HH:mm')}
                </p>
              )}
              {request.doctorName && (
                <p>
                  <span className='text-muted-foreground'>Bác sĩ: </span>
                  {request.doctorName}
                </p>
              )}
              {request.doctorNotes && (
                <p>
                  <span className='text-muted-foreground'>Ghi chú bác sĩ: </span>
                  {request.doctorNotes}
                </p>
              )}
              {request.userCourseId && (
                <p>
                  <span className='text-muted-foreground'>Mã khóa tập: </span>
                  <span className='font-medium'>#{request.userCourseId}</span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Trainer notes */}
        {request.trainerNotes && (
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú của kỹ thuật viên</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm whitespace-pre-wrap'>{request.trainerNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Course details */}
        <CourseDetailsReadOnly courseDetails={request.courseDetails} />
      </Main>
    </>
  )
}
