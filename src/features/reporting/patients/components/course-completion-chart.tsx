import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCourseStats } from '@/api'
import { formatPercent } from '../../lib/formatters'

export function CourseCompletionChart() {
	const { data, isLoading } = useGetCourseStats()

	const chartData =
		data?.map((c) => ({
			name:
				(c.courseTitle ?? 'Không tên').length > 25
					? `${(c.courseTitle ?? '').slice(0, 25)}…`
					: c.courseTitle ?? 'Không tên',
			fullName: c.courseTitle ?? 'Không tên',
			'Hoàn thành': c.completed ?? 0,
			'Đang học': c.inProgress ?? 0,
			'Bỏ dở': c.dropped ?? 0,
			completionRate: c.completionRate ?? 0,
		})) ?? []

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tỷ lệ hoàn thành theo khóa học</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className='h-[400px] w-full' />
				) : chartData.length === 0 ? (
					<div className='text-muted-foreground flex h-[300px] items-center justify-center'>
						Chưa có dữ liệu khóa học
					</div>
				) : (
					<ResponsiveContainer width='100%' height={Math.max(300, chartData.length * 50)}>
						<BarChart data={chartData} layout='vertical' margin={{ left: 20 }}>
							<CartesianGrid
								strokeDasharray='3 3'
								className='stroke-border'
								horizontal={false}
							/>
							<XAxis type='number' fontSize={12} />
							<YAxis
								dataKey='name'
								type='category'
								width={180}
								fontSize={12}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: '8px',
									border: '1px solid hsl(var(--border))',
									backgroundColor: 'hsl(var(--popover))',
									color: 'hsl(var(--popover-foreground))',
								}}
								labelFormatter={(_, payload) => {
									if (payload?.[0]?.payload?.fullName)
										return payload[0].payload.fullName
									return ''
								}}
								formatter={(value: number, name: string, props) => {
									if (name === 'completionRate') return null
									const suffix =
										props?.payload?.completionRate != null
											? ` (${formatPercent(props.payload.completionRate)})`
											: ''
									return [`${value}${suffix}`, name]
								}}
							/>
							<Legend />
							<Bar
								dataKey='Hoàn thành'
								stackId='a'
								fill='var(--chart-1)'
								radius={[0, 0, 0, 0]}
							/>
							<Bar
								dataKey='Đang học'
								stackId='a'
								fill='var(--chart-3)'
							/>
							<Bar
								dataKey='Bỏ dở'
								stackId='a'
								fill='var(--chart-5)'
								radius={[0, 4, 4, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	)
}
