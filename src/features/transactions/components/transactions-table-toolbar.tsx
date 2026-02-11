import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateRangePicker } from '@/components/date-range-picker'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { TransactionRecord } from './transactions-columns'
import type { DateRange } from 'react-day-picker'

type TransactionsTableToolbarProps = {
  table: Table<TransactionRecord>
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function TransactionsTableToolbar({
  table,
  search,
  navigate,
}: TransactionsTableToolbarProps) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    search.startDate ||
    search.endDate

  const dateRange: DateRange | undefined =
    search.startDate || search.endDate
      ? {
          from: search.startDate
            ? new Date(search.startDate as string)
            : undefined,
          to: search.endDate ? new Date(search.endDate as string) : undefined,
        }
      : undefined

  const handleDateRangeChange = (range: DateRange | undefined) => {
    const startDate = range?.from
      ? format(range.from, 'yyyy-MM-dd')
      : undefined
    const endDate = range?.to
      ? format(range.to, 'yyyy-MM-dd')
      : undefined

    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        startDate,
        endDate,
      }),
    })
  }

  const handleReset = () => {
    table.resetColumnFilters()
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        userName: undefined,
        startDate: undefined,
        endDate: undefined,
      }),
    })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Tìm kiếm theo tên người dùng...'
          value={
            (table.getColumn('userName_filter')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('userName_filter')
              ?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[300px]'
        />

        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          placeholder='Chọn khoảng thời gian'
        />

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={handleReset}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
