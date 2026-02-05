import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type UserResponse } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { MyPatientsTableRowActions } from './my-patients-table-row-actions'

export const myPatientsColumns: ColumnDef<UserResponse>[] = [
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
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Giới tính' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string | undefined
      const displayGender = gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender || '-'
      return <div>{displayGender}</div>
    },
  },
  {
    accessorKey: 'dateOfBirth',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày sinh' />
    ),
    cell: ({ row }) => {
      const dateOfBirth = row.getValue('dateOfBirth') as string | undefined
      return (
        <div>
          {dateOfBirth ? format(new Date(dateOfBirth), 'dd/MM/yyyy') : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber') || '-'}</div>,
  },
  {
    accessorKey: 'assignedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày gắn' />
    ),
    cell: ({ row }) => {
      const dateOfBirth = row.getValue('assignedAt') as string | undefined
      return (
        <div>
          {dateOfBirth ? format(new Date(dateOfBirth), 'dd/MM/yyyy') : '-'}
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
