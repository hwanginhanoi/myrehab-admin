import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter, DataTableViewOptions } from '@/components/server-data-table'
import type { AppointmentResponse } from '@/api'
import { appointmentStatusOptions } from '@/lib/appointment-utils'

type AppointmentsTableToolbarProps = {
  table: Table<AppointmentResponse>
}

export function AppointmentsTableToolbar({ table }: AppointmentsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Tìm kiếm bệnh nhân...'
          value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('userName')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Trạng thái'
            options={appointmentStatusOptions}
          />
        )}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
