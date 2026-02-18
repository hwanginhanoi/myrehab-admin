import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/server-data-table'
import { Badge } from '@/components/ui/badge'
import { LongText } from '@/components/long-text'
import {
	formatVND,
	formatDateTime,
	TRANSACTION_TYPE_LABELS,
} from '../../lib/formatters'

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

const DEPOSIT_TYPES = new Set(['BALANCE_ADD', 'BALANCE_ADD_SEPAY', 'REFUND'])

function TransactionTypeBadge({ type }: { type: string }) {
	const isDeposit = DEPOSIT_TYPES.has(type)
	return (
		<Badge variant={isDeposit ? 'default' : 'secondary'} className='text-nowrap'>
			{TRANSACTION_TYPE_LABELS[type] ?? type}
		</Badge>
	)
}

export const transactionColumns: ColumnDef<TransactionRecord>[] = [
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
			<DataTableColumnHeader column={column} title='Loại GD' />
		),
		cell: ({ row }) => (
			<TransactionTypeBadge type={row.getValue('transactionType')} />
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
			const isNegative = amount < 0
			return (
				<div className={isNegative ? 'font-medium text-red-600' : 'font-medium text-emerald-600'}>
					{formatVND(amount)}
				</div>
			)
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
				{(row.getValue('description') as string) || '-'}
			</LongText>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Thời gian' />
		),
		cell: ({ row }) => formatDateTime(row.getValue('createdAt') as string),
		enableSorting: false,
	},
]
