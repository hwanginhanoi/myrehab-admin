import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type DoctorPatientResponse } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { MyPatientsTableRowActions } from './my-patients-table-row-actions'

export const myPatientsColumns: ColumnDef<DoctorPatientResponse>[] = [
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
    header: () => <div className='text-right'>Hành động</div>,
    cell: MyPatientsTableRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[100px]',
    },
  },
]
