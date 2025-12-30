import { useState, useEffect } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/server-data-table'
import type { RehabilitationExaminationFormResponse } from '@/api'

type RehabilitationFormsTableToolbarProps = {
  table: Table<RehabilitationExaminationFormResponse>
}

export function RehabilitationFormsTableToolbar({ table }: RehabilitationFormsTableToolbarProps) {
  const [searchValue, setSearchValue] = useState<string>(
    (table.getColumn('patientName')?.getFilterValue() as string) ?? ''
  )

  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  // Debounce search: only update filter after 500ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      table.getColumn('patientName')?.setFilterValue(searchValue || undefined)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue, table])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Search by patient name */}
        <Input
          placeholder='Tìm kiếm theo tên bệnh nhân...'
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

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
