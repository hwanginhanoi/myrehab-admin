import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type StaffResponse } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { TrainersTableRowActions } from './trainers-table-row-actions'

export const trainersColumns: ColumnDef<StaffResponse>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Họ và tên' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('fullName') || '-'}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div>{row.getValue('email') || '-'}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày thêm' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string | undefined
      return (
        <div>
          {createdAt ? format(new Date(createdAt), 'dd/MM/yyyy') : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Thao tác</div>,
    cell: TrainersTableRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[100px]',
    },
  },
]
