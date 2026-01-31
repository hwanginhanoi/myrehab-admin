import { type Table } from '@tanstack/react-table'
import { DataTableViewOptions } from '@/components/server-data-table'
import { type DoctorPatientResponse } from '@/api'

type PatientsTableToolbarProps = {
  table: Table<DoctorPatientResponse>
}

export function PatientsTableToolbar({ table }: PatientsTableToolbarProps) {
  return (
    <div className='flex items-center justify-end'>
      <DataTableViewOptions table={table} />
    </div>
  )
}
