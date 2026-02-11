import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/server-data-table'
import { LongText } from '@/components/long-text'

export type TransactionRecord = {
  id: number
  userName: string
  phoneNumber: string
  transactionType: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  subscriptionId: number | null
  createdAt: string
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)

export const transactionsColumns: ColumnDef<TransactionRecord>[] = [
  {
    accessorKey: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên người dùng' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('userName')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('phoneNumber') || '-'}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số tiền' />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return <div className='font-medium'>{formatVND(amount)}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'balanceBefore',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số dư trước' />
    ),
    cell: ({ row }) => formatVND(row.getValue('balanceBefore') as number),
    enableSorting: false,
  },
  {
    accessorKey: 'balanceAfter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số dư sau' />
    ),
    cell: ({ row }) => formatVND(row.getValue('balanceAfter') as number),
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mô tả' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-[300px]'>
        {row.getValue('description') || '-'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'
    },
    enableSorting: false,
  },
]
