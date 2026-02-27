import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetCourseRequests, type CourseAssignmentRequestResponse } from '@/api'
import { DoctorCourseRequestsTable } from './components/doctor-course-requests-table'
import type { CourseRequestStatus } from '@/features/course-requests/types'

const route = getRouteApi('/_authenticated/doctor-course-requests/')

export function DoctorCourseRequests() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = search.page ?? 1
  const pageSize = search.pageSize ?? 10
  const status = search.status

  const { data, isLoading } = useGetCourseRequests(
    {
      status,
      pageable: { page: page - 1, size: pageSize },
    },
    {
      query: {
        placeholderData: (prev) => prev,
      },
    }
  )

  // Fetch pending count for badge
  const { data: pendingData } = useGetCourseRequests({
    status: 'PENDING',
    pageable: { page: 0, size: 1 },
  })

  const requests = (data?.content ?? []) as CourseAssignmentRequestResponse[]
  const totalPages = data?.page?.totalPages ?? 0
  const pendingCount = pendingData?.page?.totalElements ?? 0

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Xét duyệt khóa tập</h2>
            <p className='text-muted-foreground'>
              Xem xét và phê duyệt các yêu cầu gán khóa tập từ kỹ thuật viên.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <span className='text-muted-foreground'>Đang tải...</span>
          </div>
        ) : (
          <DoctorCourseRequestsTable
            data={requests}
            pageCount={totalPages}
            currentPage={page}
            pageSize={pageSize}
            currentStatus={status}
            pendingCount={pendingCount}
            onPageChange={(newPage) => navigate({ search: (prev) => ({ ...prev, page: newPage }) })}
            onPageSizeChange={(newPageSize) => navigate({ search: (prev) => ({ ...prev, pageSize: newPageSize, page: 1 }) })}
            onStatusChange={(newStatus?: CourseRequestStatus) => navigate({ search: (prev) => ({ ...prev, status: newStatus, page: 1 }) })}
          />
        )}
      </Main>
    </>
  )
}
