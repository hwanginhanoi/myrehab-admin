import { useMemo, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateRangePicker } from '@/components/date-range-picker'
import {
  DataTableFacetedFilter,
  DataTableSingleSelectFilter,
  DataTableViewOptions,
} from '@/components/server-data-table'
import type { CourseAssignmentDetail } from '../types'
import { purchaseStatusOptions } from '@/lib/course-assignment-utils'
import { useAuthStore } from '@/stores/auth-store'
import { useGetAllStaff, useGetAllCourses, type StaffResponse, type CourseMetadataDto } from '@/api'

type CourseAssignmentsTableToolbarProps = {
  table: Table<CourseAssignmentDetail>
}

export function CourseAssignmentsTableToolbar({ table }: CourseAssignmentsTableToolbarProps) {
  const { auth } = useAuthStore()
  const isAdmin = auth.userType === 'SUPER_ADMIN' || auth.userType === 'ADMIN'
  const isFiltered = table.getState().columnFilters.length > 0

  // Fetch doctors for admin users
  const { data: staffData } = useGetAllStaff(
    {
      pageable: { page: 0, size: 100 },
      staffType: 'DOCTOR' as const,
    },
    {
      query: {
        enabled: isAdmin,
      },
    }
  )

  const doctorOptions = useMemo(() => {
    if (!staffData?.content) return []
    return (staffData.content as StaffResponse[]).map((staff) => ({
      label: staff.fullName || staff.email || 'Unknown',
      value: String(staff.id),
    }))
  }, [staffData])

  // Fetch courses for filter
  const { data: coursesData } = useGetAllCourses({
    pageable: { page: 0, size: 100 },
  })

  const courseOptions = useMemo(() => {
    if (!coursesData?.content) return []
    return (coursesData.content as CourseMetadataDto[]).map((course) => ({
      label: course.title || 'Unknown',
      value: String(course.id),
    }))
  }, [coursesData])

  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDateFilter = table.getColumn('startDate')?.getFilterValue() as string | undefined
    const endDateFilter = table.getColumn('endDate')?.getFilterValue() as string | undefined

    if (startDateFilter || endDateFilter) {
      return {
        from: startDateFilter ? new Date(startDateFilter) : undefined,
        to: endDateFilter ? new Date(endDateFilter) : undefined,
      }
    }
    return undefined
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from) {
      table.getColumn('startDate')?.setFilterValue(format(range.from, "yyyy-MM-dd'T'00:00:00"))
    } else {
      table.getColumn('startDate')?.setFilterValue(undefined)
    }

    if (range?.to) {
      table.getColumn('endDate')?.setFilterValue(format(range.to, "yyyy-MM-dd'T'23:59:59"))
    } else {
      table.getColumn('endDate')?.setFilterValue(undefined)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Tìm kiếm bệnh nhân...'
            value={(table.getColumn('patientName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('patientName')?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />

          {table.getColumn('courseId') && (
            <DataTableSingleSelectFilter
              column={table.getColumn('courseId')}
              title='Khóa tập'
              options={courseOptions}
            />
          )}

          {isAdmin && table.getColumn('doctorId') && (
            <DataTableSingleSelectFilter
              column={table.getColumn('doctorId')}
              title='Bác sĩ'
              options={doctorOptions}
            />
          )}

          {table.getColumn('purchaseStatus') && (
            <DataTableFacetedFilter
              column={table.getColumn('purchaseStatus')}
              title='Trạng thái thanh toán'
              options={purchaseStatusOptions}
            />
          )}

          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            placeholder='Chọn khoảng thời gian'
            className='h-8'
          />

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                setDateRange(undefined)
              }}
              className='h-8 px-2 lg:px-3'
            >
              Reset
              <Cross2Icon className='ms-2 h-4 w-4' />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
