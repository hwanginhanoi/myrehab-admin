import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/server-data-table'
import { type DoctorPatientResponse } from '@/api'

type MyPatientsTableToolbarProps = {
  table: Table<DoctorPatientResponse>
}

export function MyPatientsTableToolbar({ table }: MyPatientsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Tìm kiếm theo tên hoặc số điện thoại...'
          value={(table.getColumn('query')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('query')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[300px]'
        />

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
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
  )
}
