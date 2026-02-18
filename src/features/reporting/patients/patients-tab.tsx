import { useMemo } from 'react'
import { Users, BookOpen, CheckCircle, BarChart3 } from 'lucide-react'
import { useGetCourseStats, useGetDoctorStats } from '@/api'
import { StatCard } from '../components/stat-card'
import { formatNumber, formatPercent } from '../lib/formatters'
import { CourseCompletionChart } from './components/course-completion-chart'
import { DoctorStatsTable } from './components/doctor-stats-table'
import { LowEffortTable } from './components/low-effort-table'

export function PatientsTab() {
	const { data: courseStats, isLoading: courseLoading } = useGetCourseStats()
	const { data: doctorStats, isLoading: doctorLoading } = useGetDoctorStats()

	const summary = useMemo(() => {
		if (!courseStats)
			return {
				totalAssigned: 0,
				inProgress: 0,
				completed: 0,
				avgCompletion: 0,
			}

		const totalAssigned = courseStats.reduce(
			(s, c) => s + (c.totalAssigned ?? 0),
			0
		)
		const inProgress = courseStats.reduce(
			(s, c) => s + (c.inProgress ?? 0),
			0
		)
		const completed = courseStats.reduce(
			(s, c) => s + (c.completed ?? 0),
			0
		)
		const rates = courseStats
			.filter((c) => c.completionRate != null)
			.map((c) => c.completionRate!)
		const avgCompletion =
			rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0

		return { totalAssigned, inProgress, completed, avgCompletion }
	}, [courseStats])

	const totalDoctorPatients = useMemo(
		() =>
			doctorStats?.reduce((s, d) => s + (d.patientCount ?? 0), 0) ?? 0,
		[doctorStats]
	)

	const isLoading = courseLoading || doctorLoading

	return (
		<div className='space-y-6'>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<StatCard
					title='Tổng bệnh nhân (qua bác sĩ)'
					value={formatNumber(totalDoctorPatients)}
					icon={Users}
					isLoading={isLoading}
				/>
				<StatCard
					title='Đang theo khóa'
					value={formatNumber(summary.inProgress)}
					icon={BookOpen}
					isLoading={isLoading}
				/>
				<StatCard
					title='Đã hoàn thành'
					value={formatNumber(summary.completed)}
					icon={CheckCircle}
					variant='success'
					isLoading={isLoading}
				/>
				<StatCard
					title='Tỷ lệ hoàn thành TB'
					value={formatPercent(summary.avgCompletion)}
					icon={BarChart3}
					isLoading={isLoading}
				/>
			</div>

			<CourseCompletionChart />
			<DoctorStatsTable />
			<LowEffortTable />
		</div>
	)
}
