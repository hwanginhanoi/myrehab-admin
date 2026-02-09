import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type UserResponse } from '@/api'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { genderLabels } from '@/lib/constants/gender'
import { UsersTableRowActions } from './users-table-row-actions'

export const usersColumns: ColumnDef<UserResponse>[] = [
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
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber') || '-'}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div>{row.getValue('email') || '-'}</div>,
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Giới tính' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string | undefined
      return (
        <Badge variant='outline'>
          {gender ? (genderLabels[gender] || gender) : '-'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
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
    header: () => <div className='text-right'>Hành động</div>,
    cell: UsersTableRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[100px]',
    },
  },
]
