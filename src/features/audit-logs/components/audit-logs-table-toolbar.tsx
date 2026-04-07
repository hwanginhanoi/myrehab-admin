import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import { DataTableSingleSelectFilter } from '@/components/server-data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { DateRange } from 'react-day-picker'
import { type AuditLogRecord, ACTION_LABELS, ENTITY_TYPE_LABELS } from '../types'

type AuditLogsTableToolbarProps = {
  table: Table<AuditLogRecord>
  search: {
    page?: number
    pageSize?: number
    action?: string
    entityType?: string
    from?: string
    to?: string
  }
  navigate: NavigateFn
}

const actionOptions = Object.entries(ACTION_LABELS).map(([value, { label }]) => ({
  label,
  value,
}))

const entityTypeOptions = Object.entries(ENTITY_TYPE_LABELS).map(
  ([value, label]) => ({
    label,
    value,
  })
)

export function AuditLogsTableToolbar({
  table,
  search,
  navigate,
}: AuditLogsTableToolbarProps) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    search.from ||
    search.to

  const dateRange: DateRange | undefined =
    search.from || search.to
      ? {
          from: search.from ? new Date(search.from) : undefined,
          to: search.to ? new Date(search.to) : undefined,
        }
      : undefined

  const handleDateRangeChange = (range: DateRange | undefined) => {
    const from = range?.from ? format(range.from, 'yyyy-MM-dd') : undefined
    const to = range?.to ? format(range.to, 'yyyy-MM-dd') : undefined

    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        from,
        to,
      }),
    })
  }

  const handleReset = () => {
    table.resetColumnFilters()
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        action: undefined,
        entityType: undefined,
        from: undefined,
        to: undefined,
      }),
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          placeholder="Chọn khoảng thời gian"
        />

        <DataTableSingleSelectFilter
          column={table.getColumn('action_filter')}
          title="Hành động"
          options={actionOptions}
        />

        <DataTableSingleSelectFilter
          column={table.getColumn('entity_type_filter')}
          title="Loại đối tượng"
          options={entityTypeOptions}
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-8 px-2 lg:px-3"
          >
            Xóa bộ lọc
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
