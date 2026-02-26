import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import type { CourseAssignmentRequestResponse } from '@/api'
import { CourseRequestStatusBadge } from '@/features/course-requests/components/course-request-status-badge'
import { CourseDetailsReadOnly } from '@/features/course-request-detail/components/course-details-read-only'
import { ReviewActionPanel } from '@/features/doctor-course-requests/components/review-action-panel'

type DoctorCourseRequestDetailProps = {
  request: CourseAssignmentRequestResponse
}

export function DoctorCourseRequestDetail({ request }: DoctorCourseRequestDetailProps) {
  const navigate = useNavigate()

  const isPending = request.status === 'PENDING'
  const isApproved = request.status === 'APPROVED'
  const isRejected = request.status === 'REJECTED'

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
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/doctor-course-requests', search: { page: 1, pageSize: 10 } })}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Chi tiết yêu cầu</h2>
              <CourseRequestStatusBadge status={request.status} />
            </div>
            <p className='text-muted-foreground text-sm'>
              Kỹ thuật viên: <span className='font-medium'>{request.trainerName || '-'}</span>
              {' · '}
              Bệnh nhân: <span className='font-medium'>{request.patientName || '-'}</span>
              {request.createdAt && (
                <> · Ngày tạo: {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}</>
              )}
            </p>
          </div>
        </div>

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

        {/* Review action panel (only for PENDING) */}
        {isPending && <ReviewActionPanel requestId={request.id!} />}

        {/* Approved outcome */}
        {isApproved && (
          <Card className='border-green-500'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-green-600'>
                <CheckCircle className='h-5 w-5' />
                Đã phê duyệt
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              {request.reviewedAt && (
                <p>
                  <span className='text-muted-foreground'>Ngày duyệt: </span>
                  {format(new Date(request.reviewedAt), 'dd/MM/yyyy HH:mm')}
                </p>
              )}
              {request.doctorNotes && (
                <p>
                  <span className='text-muted-foreground'>Ghi chú: </span>
                  {request.doctorNotes}
                </p>
              )}
              {request.userCourseId && (
                <p>
                  <span className='text-muted-foreground'>Mã khóa tập được tạo: </span>
                  <span className='font-medium'>#{request.userCourseId}</span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rejected outcome */}
        {isRejected && (
          <Card className='border-red-500'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-red-600'>
                <XCircle className='h-5 w-5' />
                Đã từ chối
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              {request.reviewedAt && (
                <p>
                  <span className='text-muted-foreground'>Ngày từ chối: </span>
                  {format(new Date(request.reviewedAt), 'dd/MM/yyyy HH:mm')}
                </p>
              )}
              {request.doctorNotes && (
                <p>
                  <span className='text-muted-foreground'>Lý do: </span>
                  <span className='text-red-700'>{request.doctorNotes}</span>
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}
