import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetRevenue } from '@/api'
import {
	formatVND,
	TRANSACTION_TYPE_LABELS,
	CHART_COLORS,
} from '../../lib/formatters'

const REVENUE_TYPE_LABELS: Record<string, string> = {
	COURSE_PURCHASE: 'Mua khóa học',
	PACKAGE_PURCHASE: 'Mua gói bài tập',
	APPOINTMENT_BOOKING: 'Đặt lịch hẹn',
	BALANCE_DEPOSIT: 'Nạp tiền',
	REFUND: 'Hoàn tiền',
}

export function RevenueBreakdown() {
	const { data, isLoading } = useGetRevenue()

	const pieData = useMemo(() => {
		if (!data?.revenueByType) return []
		return Object.entries(data.revenueByType)
			.filter(([, value]) => value > 0)
			.map(([key, value]) => ({
				name: REVENUE_TYPE_LABELS[key] ?? TRANSACTION_TYPE_LABELS[key] ?? key,
				value,
			}))
	}, [data])

	const total = useMemo(
		() => pieData.reduce((sum, d) => sum + d.value, 0),
		[pieData]
	)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Phân bổ doanh thu</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className='mx-auto h-[300px] w-[300px] rounded-full' />
				) : pieData.length === 0 ? (
					<div className='text-muted-foreground flex h-[300px] items-center justify-center'>
						Chưa có dữ liệu
					</div>
				) : (
					<div className='flex flex-col items-center gap-4'>
						<ResponsiveContainer width='100%' height={250}>
							<PieChart>
								<Pie
									data={pieData}
									cx='50%'
									cy='50%'
									innerRadius={60}
									outerRadius={100}
									paddingAngle={2}
									dataKey='value'
								>
									{pieData.map((_, index) => (
										<Cell
											key={index}
											fill={CHART_COLORS[index % CHART_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										borderRadius: '8px',
										border: '1px solid hsl(var(--border))',
										backgroundColor: 'hsl(var(--popover))',
										color: 'hsl(var(--popover-foreground))',
									}}
									formatter={(value: number) => formatVND(value)}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className='grid w-full grid-cols-2 gap-2 text-sm'>
							{pieData.map((d, i) => (
								<div key={d.name} className='flex items-center gap-2'>
									<div
										className='h-3 w-3 shrink-0 rounded-full'
										style={{
											backgroundColor:
												CHART_COLORS[i % CHART_COLORS.length],
										}}
									/>
									<span className='text-muted-foreground truncate'>
										{d.name}
									</span>
									<span className='ms-auto font-medium'>
										{total > 0
											? `${((d.value / total) * 100).toFixed(0)}%`
											: '0%'}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
