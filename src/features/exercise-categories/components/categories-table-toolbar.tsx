import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableSingleSelectFilter, DataTableViewOptions } from '@/components/server-data-table'
import { categoryTypeOptions } from '@/lib/constants/category-type'
import type { CategoryResponse } from '@/api'

type CategoriesTableToolbarProps = {
  table: Table<CategoryResponse>
}

export function CategoriesTableToolbar({ table }: CategoriesTableToolbarProps) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Search by name */}
        <Input
          placeholder='Tìm kiếm danh mục...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {/* Type filter - Single select */}
        <div className='flex gap-x-2'>
          <DataTableSingleSelectFilter
            column={table.getColumn('type')}
            title='Phân loại'
            options={categoryTypeOptions}
          />
        </div>

        {/* Reset filters button */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Column visibility toggle */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
