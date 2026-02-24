import { useMemo } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PainReportResponse } from '@/api/types/PainReportResponse'

type PainByDayChartProps = {
	data: PainReportResponse[] | undefined
	isLoading: boolean
}

export function PainByDayChart({ data, isLoading }: PainByDayChartProps) {
	const chartData = useMemo(() => {
		if (!data?.length) return []
		const byDay = new Map<number, number>()
		for (const report of data) {
			const day = report.dayNumber ?? 0
			byDay.set(day, (byDay.get(day) ?? 0) + 1)
		}
		return Array.from(byDay.entries())
			.sort((a, b) => a[0] - b[0])
			.map(([day, count]) => ({
				day: `Ngày ${day}`,
				count,
			}))
	}, [data])

	return (
		<Card>
			<CardHeader>
				<CardTitle>Báo cáo đau theo ngày</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className='h-[300px] w-full' />
				) : chartData.length === 0 ? (
					<div className='text-muted-foreground flex h-[300px] items-center justify-center'>
						Chưa có báo cáo đau
					</div>
				) : (
					<ResponsiveContainer width='100%' height={300}>
						<BarChart data={chartData}>
							<CartesianGrid
								strokeDasharray='3 3'
								className='stroke-border'
							/>
							<XAxis
								dataKey='day'
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								fontSize={12}
								tickLine={false}
								axisLine={false}
								allowDecimals={false}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: '8px',
									border: '1px solid hsl(var(--border))',
									backgroundColor: 'hsl(var(--popover))',
									color: 'hsl(var(--popover-foreground))',
								}}
								formatter={(value: number) => [`${value} báo cáo`, 'Số lượng']}
							/>
							<Bar
								dataKey='count'
								fill='var(--chart-5)'
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	)
}
