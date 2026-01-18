import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type DoctorPatientResponse } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { PatientsTableRowActions } from './patients-table-row-actions'

export const patientsColumns: ColumnDef<DoctorPatientResponse>[] = [
  {
    accessorKey: 'userPhoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('userPhoneNumber') || '-'}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID Bệnh nhân' />
    ),
    cell: ({ row }) => <div>{row.getValue('userId') || '-'}</div>,
  },
  {
    accessorKey: 'assignedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày gán' />
    ),
    cell: ({ row }) => {
      const assignedAt = row.getValue('assignedAt') as string | undefined
      return (
        <div>
          {assignedAt ? format(new Date(assignedAt), 'dd/MM/yyyy HH:mm') : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string | undefined
      return (
        <div className='max-w-[300px] truncate' title={notes}>
          {notes || '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Thao tác</div>,
    cell: PatientsTableRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[100px]',
    },
  },
]
