import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Cross2Icon, DownloadIcon } from '@radix-ui/react-icons'
import {
	type SortingState,
	type VisibilityState,
	type PaginationState,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import {
	useGetAllTransactionHistory,
	type GetAllTransactionHistoryQueryParams,
} from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/server-data-table'
import { ReportingDateRange } from '../components/reporting-date-range'
import {
	transactionColumns,
	type TransactionRecord,
} from './components/transaction-columns'
import {
	formatVND,
	formatDateTime,
	TRANSACTION_TYPE_LABELS,
} from '../lib/formatters'

export function TransactionsTab() {
	const [query, setQuery] = useState('')
	const [debouncedQuery, setDebouncedQuery] = useState('')
	const [dateRange, setDateRange] = useState<DateRange | undefined>()
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 20,
	})
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(query), 400)
		return () => clearTimeout(timer)
	}, [query])

	const queryParams = useMemo<GetAllTransactionHistoryQueryParams>(
		() => ({
			pageable: {
				page: pagination.pageIndex,
				size: pagination.pageSize,
			},
			...(debouncedQuery && { query: debouncedQuery }),
			...(dateRange?.from && {
				startDate: `${format(dateRange.from, 'yyyy-MM-dd')}T00:00:00`,
			}),
			...(dateRange?.to && {
				endDate: `${format(dateRange.to, 'yyyy-MM-dd')}T23:59:59`,
			}),
		}),
		[pagination, debouncedQuery, dateRange]
	)

	const { data: response, isLoading } = useGetAllTransactionHistory(
		queryParams,
		{ query: { placeholderData: (prev) => prev } }
	)

	const transactions = (response?.content as TransactionRecord[]) ?? []
	const totalPages = response?.page?.totalPages ?? 0

	const table = useReactTable({
		data: transactions,
		columns: transactionColumns,
		pageCount: totalPages,
		state: { sorting, pagination, columnVisibility },
		manualPagination: true,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
	})

	const isFiltered = debouncedQuery || dateRange?.from

	const handleExportCSV = () => {
		if (!transactions.length) return

		const headers = [
			'Tên',
			'Loại GD',
			'Số tiền',
			'Số dư trước',
			'Số dư sau',
			'Mô tả',
			'Thời gian',
		]
		const rows = transactions.map((t) => [
			t.userName,
			TRANSACTION_TYPE_LABELS[t.transactionType] ?? t.transactionType,
			formatVND(t.amount),
			formatVND(t.balanceBefore),
			formatVND(t.balanceAfter),
			t.description ?? '',
			formatDateTime(t.createdAt),
		])

		const csv = [headers, ...rows]
			.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
			.join('\n')

		const blob = new Blob(['\uFEFF' + csv], {
			type: 'text/csv;charset=utf-8;',
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className='flex flex-1 flex-col gap-4'>
			<div className='flex flex-wrap items-center gap-2'>
				<Input
					placeholder='Tìm kiếm theo tên hoặc SĐT...'
					value={query}
					onChange={(e) => {
						setQuery(e.target.value)
						setPagination((p) => ({ ...p, pageIndex: 0 }))
					}}
					className='h-8 w-[200px] lg:w-[300px]'
				/>
				<ReportingDateRange
					dateRange={dateRange}
					onDateRangeChange={(range) => {
						setDateRange(range)
						setPagination((p) => ({ ...p, pageIndex: 0 }))
					}}
				/>
				{isFiltered && (
					<Button
						variant='ghost'
						size='sm'
						onClick={() => {
							setQuery('')
							setDebouncedQuery('')
							setDateRange(undefined)
							setPagination((p) => ({ ...p, pageIndex: 0 }))
						}}
					>
						Xóa bộ lọc
						<Cross2Icon className='ms-2 h-4 w-4' />
					</Button>
				)}
				<Button
					variant='outline'
					size='sm'
					className='ms-auto'
					onClick={handleExportCSV}
					disabled={!transactions.length}
				>
					<DownloadIcon className='me-2 h-4 w-4' />
					Xuất CSV
				</Button>
			</div>

			<div className='overflow-hidden rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className='group/row'>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										colSpan={header.colSpan}
										className={cn(
											'bg-background group-hover/row:bg-muted',
											header.column.columnDef.meta?.className
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									{transactionColumns.map((_, j) => (
										<TableCell key={j}>
											<div className='bg-muted h-4 w-full animate-pulse rounded' />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} className='group/row'>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cn(
												'bg-background group-hover/row:bg-muted',
												cell.column.columnDef.meta?.className
											)}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={transactionColumns.length}
									className='h-24 text-center'
								>
									Không có dữ liệu giao dịch.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} className='mt-auto' />
		</div>
	)
}
