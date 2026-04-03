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
import { type AuditLogRecord, SECURITY_ACTIONS } from '../types'
import { auditLogsColumns } from './audit-logs-columns'
import { AuditLogsTableToolbar } from './audit-logs-table-toolbar'

type AuditLogsTableProps = {
  data: AuditLogRecord[]
  search: {
    page?: number
    pageSize?: number
    action?: string
    entityType?: string
    from?: string
    to?: string
  }
  navigate: NavigateFn
  pageCount: number
}

export function AuditLogsTable({
  data,
  search,
  navigate,
  pageCount,
}: AuditLogsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    action_filter: false,
    entity_type_filter: false,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 20 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'action_filter', searchKey: 'action', type: 'string' },
      { columnId: 'entity_type_filter', searchKey: 'entityType', type: 'string' },
    ],
  })

  const columns = useMemo(
    () => [
      {
        id: 'action_filter',
        header: () => null,
        cell: () => null,
        enableSorting: false,
      },
      {
        id: 'entity_type_filter',
        header: () => null,
        cell: () => null,
        enableSorting: false,
      },
      ...auditLogsColumns,
    ],
    []
  )

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
      <AuditLogsTableToolbar
        table={table}
        search={search}
        navigate={navigate}
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
              table.getRowModel().rows.map((row) => {
                const isSecurityEvent = SECURITY_ACTIONS.includes(
                  row.original.action
                )
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'group/row',
                      isSecurityEvent && 'bg-red-50 dark:bg-red-950/20'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          isSecurityEvent
                            ? 'bg-red-50 group-hover/row:bg-red-100 dark:bg-red-950/20 dark:group-hover/row:bg-red-950/30'
                            : 'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
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
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không tìm thấy nhật ký hoạt động phù hợp.
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
