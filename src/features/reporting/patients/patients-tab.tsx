import { useMemo } from 'react'
import { Users, BookOpen, CheckCircle, BarChart3, Package, Activity, Clock } from 'lucide-react'
import { useGetCourseStats, useGetDoctorStats } from '@/api'
import { StatCard } from '../components/stat-card'
import { formatNumber, formatPercent } from '../lib/formatters'
import { CourseCompletionChart } from './components/course-completion-chart'
import { PackageStatsChart } from './components/package-stats-chart'
import { DoctorStatsTable } from './components/doctor-stats-table'
import { LowEffortTable } from './components/low-effort-table'

export function PatientsTab() {
	const { data, isLoading: courseLoading } = useGetCourseStats()
	const { data: doctorStats, isLoading: doctorLoading } = useGetDoctorStats()

	const courses = data?.courses ?? []
	const packages = data?.packages ?? []

	const summary = useMemo(() => {
		if (courses.length === 0)
			return {
				totalAssigned: 0,
				inProgress: 0,
				completed: 0,
				avgCompletion: 0,
			}

		const totalAssigned = courses.reduce(
			(s, c) => s + (c.totalAssigned ?? 0),
			0
		)
		const inProgress = courses.reduce(
			(s, c) => s + (c.inProgress ?? 0),
			0
		)
		const completed = courses.reduce(
			(s, c) => s + (c.completed ?? 0),
			0
		)
		const rates = courses
			.filter((c) => c.completionRate != null)
			.map((c) => c.completionRate!)
		const avgCompletion =
			rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0

		return { totalAssigned, inProgress, completed, avgCompletion }
	}, [courses])

	const packageSummary = useMemo(() => {
		return {
			totalPackages: packages.length,
			activeSubscriptions: packages.reduce((s, p) => s + (p.activeSubscriptions ?? 0), 0),
			expiredSubscriptions: packages.reduce((s, p) => s + (p.expiredSubscriptions ?? 0), 0),
		}
	}, [packages])

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

			<CourseCompletionChart courses={courses} isLoading={courseLoading} />

			<div className='grid gap-4 sm:grid-cols-3'>
				<StatCard
					title='Tổng gói tập'
					value={formatNumber(packageSummary.totalPackages)}
					icon={Package}
					isLoading={courseLoading}
				/>
				<StatCard
					title='Đang hoạt động'
					value={formatNumber(packageSummary.activeSubscriptions)}
					icon={Activity}
					variant='success'
					isLoading={courseLoading}
				/>
				<StatCard
					title='Đã hết hạn'
					value={formatNumber(packageSummary.expiredSubscriptions)}
					icon={Clock}
					isLoading={courseLoading}
				/>
			</div>

			<PackageStatsChart packages={packages} isLoading={courseLoading} />
			<DoctorStatsTable />
			<LowEffortTable />
		</div>
	)
}
