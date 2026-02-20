import { useEffect, useState, useMemo } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/server-data-table'
import type { CourseAssignmentDetail } from '../types'
import { courseAssignmentsColumns } from './course-assignments-columns'
import { CourseAssignmentsTableToolbar } from './course-assignments-table-toolbar'

type CourseAssignmentsTableProps = {
  data: CourseAssignmentDetail[]
  search: Record<string, unknown>
  navigate: NavigateFn
  pageCount: number
}

export function CourseAssignmentsTable({
  data,
  search,
  navigate,
  pageCount,
}: CourseAssignmentsTableProps) {
  // Local UI-only states
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    patientName: false,
    courseId: false,
    doctorId: false,
    includeRevoked: false,
    startDate: false,
    endDate: false,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  // Synced with URL states
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'patientName', searchKey: 'patientName', type: 'string' },
      { columnId: 'courseId', searchKey: 'courseId', type: 'string' },
      { columnId: 'doctorId', searchKey: 'doctorId', type: 'string' },
      { columnId: 'purchaseStatus', searchKey: 'purchaseStatus', type: 'array' },
      { columnId: 'includeRevoked', searchKey: 'includeRevoked', type: 'string' },
      { columnId: 'startDate', searchKey: 'startDate', type: 'string' },
      { columnId: 'endDate', searchKey: 'endDate', type: 'string' },
    ],
  })

  // Add hidden columns for filter support
  const columns = useMemo(() => [
    {
      id: 'patientName',
      header: () => null,
      cell: () => null,
      enableSorting: false,
    },
    {
      id: 'courseId',
      header: () => null,
      cell: () => null,
      enableSorting: false,
    },
    {
      id: 'doctorId',
      header: () => null,
      cell: () => null,
      enableSorting: false,
    },
    {
      id: 'includeRevoked',
      header: () => null,
      cell: () => null,
      enableSorting: false,
    },
    {
      id: 'startDate',
      header: () => null,
      cell: () => null,
      enableSorting: false,
    },
    {
      id: 'endDate',
      header: () => null,
      cell: () => null,
      enableSorting: false,
    },
    ...courseAssignmentsColumns,
  ], [])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <CourseAssignmentsTableToolbar table={table} />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
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
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
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
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
