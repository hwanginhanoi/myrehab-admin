import { type Table } from '@tanstack/react-table'
import { DataTableViewOptions } from '@/components/server-data-table'
import { type TrainerResponse } from '@/api'

type TrainersTableToolbarProps = {
  table: Table<TrainerResponse>
}

export function TrainersTableToolbar({ table }: TrainersTableToolbarProps) {
  return (
    <div className='flex items-center justify-end'>
      <DataTableViewOptions table={table} />
    </div>
  )
}
