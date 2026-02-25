import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { PatientSearchSelect } from '@/components/patient-search-select'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useListCourseAssignments, type ListCourseAssignmentsQueryParams } from '@/api'
import type { CourseAssignmentDetail } from './types'
import { CourseAssignmentsTable } from './components/course-assignments-table'

const route = getRouteApi('/_authenticated/course-assignments/')

export function CourseAssignments() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Get pagination and filter params from URL or use defaults
  // Note: URL uses 1-indexed pages, but API expects 0-indexed
  const page = search.page || 1
  const pageSize = search.pageSize || 10
  const patientId = search.patientId
  const doctorId = search.doctorId
  const purchaseStatus = search.purchaseStatus || []
  const includeRevoked = search.includeRevoked
  const startDate = search.startDate
  const endDate = search.endDate

  // Build query params with optional filters
  const queryParams = useMemo<ListCourseAssignmentsQueryParams>(
    () => ({
      pageable: {
        page: page - 1, // Convert to 0-indexed for API
        size: pageSize,
      },
      ...(patientId && { patientId }),
      ...(doctorId && { doctorId }),
      // API expects single purchaseStatus, so take first if multiple selected
      ...(purchaseStatus.length > 0 && { purchaseStatus: purchaseStatus[0] as 'PENDING_PURCHASE' | 'PURCHASED' | 'EXPIRED' }),
      ...(includeRevoked && { includeRevoked }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }),
    [page, pageSize, patientId, doctorId, purchaseStatus, includeRevoked, startDate, endDate]
  )

  // Fetch course assignments with server-side filtering and pagination
  const { data: response, isLoading } = useListCourseAssignments(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const assignments = (response?.content || []) as CourseAssignmentDetail[]
  const totalPages = response?.page?.totalPages || 0

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
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Phân công khóa tập</h2>
          <p className='text-muted-foreground'>
            Quản lý việc phân công khóa tập cho bệnh nhân trong hệ thống.
          </p>
        </div>

        <PatientSearchSelect
          selectedPatientId={patientId}
          onSelect={(patient) =>
            navigate({
              search: (s) => ({ ...s, patientId: patient?.id, page: 1 }),
            })
          }
        />

        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : (
          <CourseAssignmentsTable
            data={assignments}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>
    </>
  )
}
