import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useGetTopSpenders } from '@/api'
import { formatVND, formatNumber, formatDateTime } from '../../lib/formatters'

export function TopSpendersTable() {
	const { data, isLoading } = useGetTopSpenders({ limit: 10 })

	return (
		<Card>
			<CardHeader>
				<CardTitle>Top chi tiêu</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-3'>
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className='h-10 w-full' />
						))}
					</div>
				) : !data?.length ? (
					<div className='text-muted-foreground flex h-32 items-center justify-center'>
						Chưa có dữ liệu
					</div>
				) : (
					<div className='overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-10'>#</TableHead>
									<TableHead>Bệnh nhân</TableHead>
									<TableHead>SĐT</TableHead>
									<TableHead className='text-end'>Tổng chi</TableHead>
									<TableHead className='text-end'>Số GD</TableHead>
									<TableHead>Giao dịch cuối</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((s) => (
									<TableRow key={s.userId}>
										<TableCell>
											<Badge variant='outline'>{s.rank}</Badge>
										</TableCell>
										<TableCell className='font-medium'>
											{s.userName ?? '-'}
										</TableCell>
										<TableCell>{s.phoneNumber ?? '-'}</TableCell>
										<TableCell className='text-end font-medium'>
											{formatVND(s.totalSpent)}
										</TableCell>
										<TableCell className='text-end'>
											{formatNumber(s.transactionCount)}
										</TableCell>
										<TableCell>
											{formatDateTime(s.lastTransactionDate)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
