import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import type { PainReportResponse } from '@/api/types/PainReportResponse'
import { formatDateTime } from '../../lib/formatters'

type PainDetailTableProps = {
	data: PainReportResponse[] | undefined
	isLoading: boolean
}

export function PainDetailTable({ data, isLoading }: PainDetailTableProps) {
	const [dayFilter, setDayFilter] = useState('')

	const filtered = useMemo(() => {
		if (!data) return []
		if (!dayFilter) return data
		const num = parseInt(dayFilter, 10)
		if (isNaN(num)) return data
		return data.filter((r) => r.dayNumber === num)
	}, [data, dayFilter])

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<CardTitle>Chi tiết báo cáo đau</CardTitle>
					<Input
						placeholder='Lọc theo ngày (VD: 5)'
						value={dayFilter}
						onChange={(e) => setDayFilter(e.target.value)}
						className='h-8 w-32'
					/>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-3'>
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className='h-10 w-full' />
						))}
					</div>
				) : filtered.length === 0 ? (
					<div className='text-muted-foreground flex h-32 items-center justify-center'>
						Chưa có báo cáo đau nào
					</div>
				) : (
					<div className='overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-20'>Ngày</TableHead>
									<TableHead>Bệnh nhân</TableHead>
									<TableHead>SĐT</TableHead>
									<TableHead>Khóa học</TableHead>
									<TableHead className='min-w-[200px]'>
										Chi tiết đau
									</TableHead>
									<TableHead>Thời gian</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.map((r) => (
									<TableRow
										key={r.feedbackId}
										className='bg-red-50/50 dark:bg-red-950/10'
									>
										<TableCell>
											<Badge variant='outline'>
												Ngày {r.dayNumber}
											</Badge>
										</TableCell>
										<TableCell className='font-medium'>
											{r.patientName ?? '-'}
										</TableCell>
										<TableCell>{r.patientPhone ?? '-'}</TableCell>
										<TableCell>{r.courseTitle ?? '-'}</TableCell>
										<TableCell>
											<p className='max-w-[300px] truncate text-sm'>
												{r.painDetails || '-'}
											</p>
										</TableCell>
										<TableCell>
											{formatDateTime(r.date)}
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
