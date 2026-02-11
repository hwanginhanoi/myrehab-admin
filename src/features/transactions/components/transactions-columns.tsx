import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/server-data-table'

export type TransactionRecord = {
  id: number
  userName: string
  transactionType: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string
  subscriptionId: number | null
  createdAt: string
}

const transactionTypeLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DEPOSIT: { label: 'Nạp tiền', variant: 'default' },
  PURCHASE: { label: 'Mua hàng', variant: 'destructive' },
  REFUND: { label: 'Hoàn tiền', variant: 'secondary' },
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
    accessorKey: 'transactionType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Loại giao dịch' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('transactionType') as string
      const config = transactionTypeLabels[type] || {
        label: type,
        variant: 'outline' as const,
      }
      return <Badge variant={config.variant}>{config.label}</Badge>
    },
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
      <div className='max-w-[300px] truncate'>
        {row.getValue('description') || '-'}
      </div>
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
