import { useMemo, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import type { DateRange } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetRevenue } from '@/api'
import { ReportingDateRange } from '../../components/reporting-date-range'
import {
	formatVND,
	getDefaultDateRange,
	toISOStart,
	toISOEnd,
} from '../../lib/formatters'

type Granularity = 'day' | 'week' | 'month'

export function RevenueChart() {
	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		getDefaultDateRange
	)
	const [groupBy, setGroupBy] = useState<Granularity>('day')

	const params = useMemo(
		() => ({
			groupBy,
			...(dateRange?.from && { start: toISOStart(dateRange.from) }),
			...(dateRange?.to && { end: toISOEnd(dateRange.to) }),
		}),
		[groupBy, dateRange]
	)

	const { data, isLoading } = useGetRevenue(params)

	const chartData = useMemo(
		() =>
			data?.dataPoints?.map((dp) => ({
				period: dp.period ?? '',
				deposit: (dp.balanceDeposit ?? 0),
				course: (dp.coursePurchase ?? 0),
				package: (dp.packagePurchase ?? 0),
				appointment: (dp.appointmentBooking ?? 0),
				total: dp.total ?? 0,
			})) ?? [],
		[data]
	)

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<CardTitle>Doanh thu theo thời gian</CardTitle>
					<div className='flex flex-wrap items-center gap-2'>
						<div className='flex rounded-md border'>
							{(['day', 'week', 'month'] as const).map((g) => (
								<Button
									key={g}
									variant={groupBy === g ? 'default' : 'ghost'}
									size='sm'
									className='rounded-none first:rounded-s-md last:rounded-e-md'
									onClick={() => setGroupBy(g)}
								>
									{g === 'day' ? 'Ngày' : g === 'week' ? 'Tuần' : 'Tháng'}
								</Button>
							))}
						</div>
						<ReportingDateRange
							dateRange={dateRange}
							onDateRangeChange={setDateRange}
						/>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className='h-[350px] w-full' />
				) : (
					<ResponsiveContainer width='100%' height={350}>
						<AreaChart data={chartData}>
							<defs>
								<linearGradient id='depositGrad' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='var(--chart-1)'
										stopOpacity={0.3}
									/>
									<stop
										offset='95%'
										stopColor='var(--chart-1)'
										stopOpacity={0}
									/>
								</linearGradient>
								<linearGradient
									id='spendingGrad'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='var(--chart-2)'
										stopOpacity={0.3}
									/>
									<stop
										offset='95%'
										stopColor='var(--chart-2)'
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								className='stroke-border'
							/>
							<XAxis
								dataKey='period'
								stroke='hsl(var(--muted-foreground))'
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								direction='ltr'
								stroke='hsl(var(--muted-foreground))'
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(v) =>
									v >= 1_000_000
										? `${(v / 1_000_000).toFixed(0)}M`
										: v >= 1_000
											? `${(v / 1_000).toFixed(0)}K`
											: String(v)
								}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: '8px',
									border: '1px solid hsl(var(--border))',
									backgroundColor: 'hsl(var(--popover))',
									color: 'hsl(var(--popover-foreground))',
								}}
								formatter={(value: number) => formatVND(value)}
							/>
							<Area
								type='monotone'
								dataKey='deposit'
								name='Nạp tiền'
								stroke='var(--chart-1)'
								fill='url(#depositGrad)'
								strokeWidth={2}
							/>
							<Area
								type='monotone'
								dataKey='total'
								name='Tổng'
								stroke='var(--chart-2)'
								fill='url(#spendingGrad)'
								strokeWidth={2}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	)
}
