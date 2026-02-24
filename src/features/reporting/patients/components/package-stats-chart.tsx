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
import type { ExercisePackageStatsResponse } from '@/api'

interface PackageStatsChartProps {
	packages: ExercisePackageStatsResponse[]
	isLoading: boolean
}

export function PackageStatsChart({ packages, isLoading }: PackageStatsChartProps) {
	const chartData = packages.map((p) => ({
		name:
			(p.packageTitle ?? 'Không tên').length > 25
				? `${(p.packageTitle ?? '').slice(0, 25)}…`
				: p.packageTitle ?? 'Không tên',
		fullName: p.packageTitle ?? 'Không tên',
		'Tổng đăng ký': p.totalSubscribed ?? 0,
		'Đang hoạt động': p.activeSubscriptions ?? 0,
		'Đã hết hạn': p.expiredSubscriptions ?? 0,
	}))

	return (
		<Card>
			<CardHeader>
				<CardTitle>Thống kê gói tập</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className='h-[400px] w-full' />
				) : chartData.length === 0 ? (
					<div className='text-muted-foreground flex h-[300px] items-center justify-center'>
						Chưa có dữ liệu gói tập
					</div>
				) : (
					<ResponsiveContainer width='100%' height={Math.max(300, packages.length * 50)}>
						<BarChart data={chartData} layout='vertical' margin={{ left: 20 }}>
							<CartesianGrid
								strokeDasharray='3 3'
								className='stroke-border'
								horizontal={false}
							/>
							<XAxis
								type='number'
								fontSize={12}
								tickLine={false}
								axisLine={false}
								stroke='#888888'
							/>
							<YAxis
								dataKey='name'
								type='category'
								width={180}
								fontSize={12}
								tickLine={false}
								axisLine={false}
								stroke='#888888'
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
							/>
							<Legend />
							<Bar
								dataKey='Tổng đăng ký'
								fill='var(--chart-1)'
								radius={[0, 4, 4, 0]}
							/>
							<Bar
								dataKey='Đang hoạt động'
								fill='var(--chart-2)'
								radius={[0, 4, 4, 0]}
							/>
							<Bar
								dataKey='Đã hết hạn'
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
