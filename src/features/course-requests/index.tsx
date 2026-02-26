import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetMyCourseRequests, type CourseAssignmentRequestResponse } from '@/api'
import { CourseRequestsTable } from './components/course-requests-table'
import type { CourseRequestStatus } from './types'

const route = getRouteApi('/_authenticated/course-requests/')

export function CourseRequests() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = search.page ?? 1
  const pageSize = search.pageSize ?? 10
  const status = search.status

  const { data, isLoading } = useGetMyCourseRequests(
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

  const requests = (data?.content ?? []) as CourseAssignmentRequestResponse[]
  const totalPages = data?.page?.totalPages ?? 0

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
            <h2 className='text-2xl font-bold tracking-tight'>Yêu cầu khóa tập</h2>
            <p className='text-muted-foreground'>
              Quản lý các yêu cầu gán khóa tập cho bệnh nhân.
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: '/course-requests/new', search: {} })}
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Yêu cầu mới
          </Button>
        </div>

        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <span className='text-muted-foreground'>Đang tải...</span>
          </div>
        ) : (
          <CourseRequestsTable
            data={requests}
            pageCount={totalPages}
            currentPage={page}
            pageSize={pageSize}
            currentStatus={status}
            onPageChange={(newPage) => navigate({ search: (prev) => ({ ...prev, page: newPage }) })}
            onPageSizeChange={(newPageSize) => navigate({ search: (prev) => ({ ...prev, pageSize: newPageSize, page: 1 }) })}
            onStatusChange={(newStatus?: CourseRequestStatus) => navigate({ search: (prev) => ({ ...prev, status: newStatus, page: 1 }) })}
          />
        )}
      </Main>
    </>
  )
}
