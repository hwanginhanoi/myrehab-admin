import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useGetLowEffortPatients } from '@/api'
import { formatPercent, formatNumber } from '../../lib/formatters'

export function LowEffortTable() {
	const [threshold, setThreshold] = useState(50)

	const { data, isLoading } = useGetLowEffortPatients({ threshold })

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<div className='flex items-center gap-2'>
						<AlertTriangle className='h-5 w-5 text-amber-500' />
						<CardTitle>Bệnh nhân ít nỗ lực</CardTitle>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-muted-foreground text-sm'>Ngưỡng:</span>
						<Select
							value={String(threshold)}
							onValueChange={(v) => setThreshold(Number(v))}
						>
							<SelectTrigger className='h-8 w-24'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='30'>30%</SelectItem>
								<SelectItem value='40'>40%</SelectItem>
								<SelectItem value='50'>50%</SelectItem>
								<SelectItem value='60'>60%</SelectItem>
								<SelectItem value='70'>70%</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='space-y-3'>
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className='h-10 w-full' />
						))}
					</div>
				) : !data?.length ? (
					<div className='text-muted-foreground flex h-32 items-center justify-center'>
						Tất cả bệnh nhân đều có nỗ lực trên {threshold}%
					</div>
				) : (
					<div className='overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Bệnh nhân</TableHead>
									<TableHead>SĐT</TableHead>
									<TableHead>Khóa học</TableHead>
									<TableHead className='w-[150px]'>Nỗ lực TB</TableHead>
									<TableHead className='text-end'>Ngày ghi nhận</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((p, i) => (
									<TableRow key={`${p.userId}-${i}`}>
										<TableCell className='font-medium'>
											{p.patientName ?? '-'}
										</TableCell>
										<TableCell>{p.patientPhone ?? '-'}</TableCell>
										<TableCell>{p.courseTitle ?? '-'}</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												<Progress
													value={p.averageEffort ?? 0}
													className='h-2'
												/>
												<span className='text-muted-foreground w-12 text-end text-xs'>
													{formatPercent(p.averageEffort)}
												</span>
											</div>
										</TableCell>
										<TableCell className='text-end'>
											{formatNumber(p.daysLogged)}
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
