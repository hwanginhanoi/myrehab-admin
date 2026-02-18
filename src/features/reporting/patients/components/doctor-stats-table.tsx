import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useGetDoctorStats } from '@/api'
import { formatNumber, formatPercent } from '../../lib/formatters'

export function DoctorStatsTable() {
	const { data, isLoading } = useGetDoctorStats()

	return (
		<Card>
			<CardHeader>
				<CardTitle>Thống kê theo bác sĩ</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-3'>
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className='h-10 w-full' />
						))}
					</div>
				) : !data?.length ? (
					<div className='text-muted-foreground flex h-32 items-center justify-center'>
						Chưa có dữ liệu bác sĩ
					</div>
				) : (
					<div className='overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Bác sĩ</TableHead>
									<TableHead>Chuyên khoa</TableHead>
									<TableHead className='text-end'>Bệnh nhân</TableHead>
									<TableHead className='text-end'>Khóa giao</TableHead>
									<TableHead className='text-end'>Hoàn thành</TableHead>
									<TableHead className='w-[150px]'>Tỷ lệ HT</TableHead>
									<TableHead className='text-end'>Lịch hẹn tháng</TableHead>
									<TableHead className='text-end'>Tranh chấp</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((d) => (
									<TableRow key={d.doctorId}>
										<TableCell className='font-medium'>
											{d.doctorName ?? '-'}
										</TableCell>
										<TableCell>{d.specialization ?? '-'}</TableCell>
										<TableCell className='text-end'>
											{formatNumber(d.patientCount)}
										</TableCell>
										<TableCell className='text-end'>
											{formatNumber(d.coursesAssigned)}
										</TableCell>
										<TableCell className='text-end'>
											{formatNumber(d.coursesCompleted)}
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Progress
													value={d.completionRate ?? 0}
													className='h-2'
												/>
												<span className='text-muted-foreground w-12 text-end text-xs'>
													{formatPercent(d.completionRate)}
												</span>
											</div>
										</TableCell>
										<TableCell className='text-end'>
											{formatNumber(d.appointmentsThisMonth)}
										</TableCell>
										<TableCell className='text-end'>
											{(d.disputeCount ?? 0) > 0 ? (
												<Badge variant='destructive'>
													{d.disputeCount}
												</Badge>
											) : (
												<span className='text-muted-foreground'>0</span>
											)}
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
