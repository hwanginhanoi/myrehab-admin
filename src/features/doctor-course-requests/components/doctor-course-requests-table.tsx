import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/server-data-table'
import type {
  CourseRequest,
  CourseRequestStatus,
} from '@/features/course-requests/types'
import { doctorCourseRequestsColumns } from './doctor-course-requests-columns'
import { DoctorCourseRequestsTableToolbar } from './doctor-course-requests-table-toolbar'

type DoctorCourseRequestsTableProps = {
  data: CourseRequest[]
  pageCount: number
  currentPage: number
  pageSize: number
  currentStatus?: CourseRequestStatus
  pendingCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onStatusChange: (status?: CourseRequestStatus) => void
}

export function DoctorCourseRequestsTable({
  data,
  pageCount,
  currentPage,
  pageSize,
  currentStatus,
  pendingCount,
  onPageChange,
  onPageSizeChange,
  onStatusChange,
}: DoctorCourseRequestsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const pagination = {
    pageIndex: currentPage - 1,
    pageSize,
  }

  const table = useReactTable({
    data,
    columns: doctorCourseRequestsColumns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater(pagination) : updater
      if (next.pageIndex !== pagination.pageIndex) {
        onPageChange(next.pageIndex + 1)
      }
      if (next.pageSize !== pagination.pageSize) {
        onPageSizeChange(next.pageSize)
      }
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (currentPage > pageCount && pageCount > 0) {
      onPageChange(pageCount)
    }
  }, [pageCount, currentPage, onPageChange])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <DoctorCourseRequestsTableToolbar
        currentStatus={currentStatus}
        onStatusChange={onStatusChange}
        pendingCount={pendingCount}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'group/row',
                    row.original.status === 'PENDING' &&
                      'bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        row.original.status !== 'PENDING' &&
                          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={doctorCourseRequestsColumns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
    </div>
  )
}
