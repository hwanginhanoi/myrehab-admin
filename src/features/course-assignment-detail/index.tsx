import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Calendar, User, Stethoscope, Dumbbell, Clock } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetCourseStructure } from '@/api'
import { PurchaseStatusBadge } from '@/features/course-assignments/components/purchase-status-badge'
import { ProgressBadge } from '@/features/course-assignments/components/progress-badge'
import { formatDate } from '@/lib/course-assignment-utils'

const route = getRouteApi('/_authenticated/course-assignments/$id')

export function CourseAssignmentDetail() {
  const search = route.useSearch()
  const navigate = useNavigate()

  const {
    courseId,
    courseTitle,
    patientFullName,
    assignedByDoctorName,
    assignedAt,
    purchaseStatus,
    hasStarted,
    isCompleted,
  } = search

  const { data: course, isLoading } = useGetCourseStructure(courseId)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/course-assignments' })}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Chi tiết phân công</h2>
          </div>
        </div>

        <div className='grid gap-4 lg:grid-cols-3'>
          {/* Assignment info — left column */}
          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Thông tin phân công</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <InfoRow icon={<User className='h-4 w-4' />} label='Bệnh nhân'>
                  {patientFullName || '-'}
                </InfoRow>
                <InfoRow icon={<Stethoscope className='h-4 w-4' />} label='Bác sĩ phân công'>
                  {assignedByDoctorName || '-'}
                </InfoRow>
                <InfoRow icon={<Calendar className='h-4 w-4' />} label='Ngày phân công'>
                  {formatDate(assignedAt)}
                </InfoRow>
                <InfoRow label='Trạng thái thanh toán'>
                  <PurchaseStatusBadge status={purchaseStatus} />
                </InfoRow>
                <InfoRow label='Tiến độ'>
                  <ProgressBadge hasStarted={hasStarted} isCompleted={isCompleted} />
                </InfoRow>
              </CardContent>
            </Card>
          </div>

          {/* Course structure — right two columns */}
          <div className='lg:col-span-2'>
            {isLoading ? (
              <div className='flex items-center justify-center h-64'>
                <p className='text-muted-foreground'>Đang tải...</p>
              </div>
            ) : course ? (
              <Card>
                <CardHeader>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <CardTitle className='flex items-center gap-2'>
                        <BookOpen className='h-5 w-5' />
                        {course.title || courseTitle || 'Khóa tập'}
                      </CardTitle>
                      {course.description && (
                        <p className='text-muted-foreground text-sm mt-1'>{course.description}</p>
                      )}
                    </div>
                    {course.durationDays != null && (
                      <Badge variant='secondary' className='shrink-0'>
                        {course.durationDays} ngày
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {course.days && course.days.length > 0 ? (
                    <div className='space-y-3'>
                      {course.days.map((day) => (
                        <div key={day.dayNumber} className='rounded-md border'>
                          {/* Day header */}
                          <div className='flex items-center justify-between px-4 py-2.5 bg-muted/50 rounded-t-md'>
                            <div>
                              <p className='text-sm font-medium'>Ngày {day.dayNumber}</p>
                              {day.description && (
                                <p className='text-xs text-muted-foreground'>{day.description}</p>
                              )}
                            </div>
                            <Badge variant='outline' className='shrink-0'>
                              {day.exercises?.length ?? 0} bài tập
                            </Badge>
                          </div>

                          {/* Exercises */}
                          {day.exercises && day.exercises.length > 0 && (
                            <div className='divide-y'>
                              {day.exercises.map((ex) => (
                                <div
                                  key={ex.dayExerciseId}
                                  className='flex items-start gap-3 px-4 py-3'
                                >
                                  {ex.imageUrl ? (
                                    <img
                                      src={ex.imageUrl}
                                      alt={ex.title}
                                      className='h-12 w-12 rounded object-cover shrink-0'
                                    />
                                  ) : (
                                    <div className='h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0'>
                                      <Dumbbell className='h-5 w-5 text-muted-foreground' />
                                    </div>
                                  )}
                                  <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium truncate'>
                                      {ex.title || 'Bài tập'}
                                    </p>
                                    {ex.description && (
                                      <p className='text-xs text-muted-foreground line-clamp-2 mt-0.5'>
                                        {ex.description}
                                      </p>
                                    )}
                                    <div className='flex items-center gap-3 mt-1.5'>
                                      {ex.durationMinutes != null && (
                                        <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                                          <Clock className='h-3 w-3' />
                                          {ex.durationMinutes} phút
                                        </span>
                                      )}
                                      {ex.customRepetitions != null && (
                                        <span className='text-xs text-muted-foreground'>
                                          {ex.customRepetitions} lần
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-sm text-muted-foreground'>Khóa tập chưa có ngày nào.</p>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </Main>
    </>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1'>
      <dt className='flex items-center gap-1.5 text-xs text-muted-foreground'>
        {icon}
        {label}
      </dt>
      <dd className='text-sm font-medium'>{children}</dd>
    </div>
  )
}
