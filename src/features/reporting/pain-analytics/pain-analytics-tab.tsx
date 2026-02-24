import { useMemo, useState } from 'react'
import { AlertTriangle, FileText, Percent } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { useGetPainReports } from '@/api'
import { StatCard } from '../components/stat-card'
import { ReportingDateRange } from '../components/reporting-date-range'
import { formatNumber, toISOStart, toISOEnd } from '../lib/formatters'
import { PainByDayChart } from './components/pain-by-day-chart'
import { PainDetailTable } from './components/pain-detail-table'

export function PainAnalyticsTab() {
	const [dateRange, setDateRange] = useState<DateRange | undefined>()

	const params = useMemo(
		() => ({
			...(dateRange?.from && { start: toISOStart(dateRange.from) }),
			...(dateRange?.to && { end: toISOEnd(dateRange.to) }),
		}),
		[dateRange]
	)

	const { data, isLoading } = useGetPainReports(
		Object.keys(params).length > 0 ? params : undefined
	)

	const totalPainReports = data?.length ?? 0

	const uniqueCourses = useMemo(() => {
		if (!data) return 0
		return new Set(data.map((r) => r.courseTitle).filter(Boolean)).size
	}, [data])

	const uniquePatients = useMemo(() => {
		if (!data) return 0
		return new Set(data.map((r) => r.patientName).filter(Boolean)).size
	}, [data])

	return (
		<div className='space-y-6'>
			<div className='flex flex-wrap items-center gap-2'>
				<ReportingDateRange
					dateRange={dateRange}
					onDateRangeChange={setDateRange}
				/>
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				<StatCard
					title='Tổng báo cáo đau'
					value={formatNumber(totalPainReports)}
					icon={AlertTriangle}
					variant={totalPainReports > 0 ? 'warning' : 'default'}
					isLoading={isLoading}
				/>
				<StatCard
					title='Bệnh nhân báo đau'
					value={formatNumber(uniquePatients)}
					icon={FileText}
					isLoading={isLoading}
				/>
				<StatCard
					title='Khóa học liên quan'
					value={formatNumber(uniqueCourses)}
					icon={Percent}
					isLoading={isLoading}
				/>
			</div>

			<PainByDayChart data={data} isLoading={isLoading} />
			<PainDetailTable data={data} isLoading={isLoading} />
		</div>
	)
}
