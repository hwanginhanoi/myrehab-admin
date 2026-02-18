import { Users, Wallet, CalendarCheck, CreditCard } from 'lucide-react'
import { useGetOverview } from '@/api'
import { StatCard } from '../../components/stat-card'
import { formatVND, formatNumber, formatPercent } from '../../lib/formatters'

export function KpiCards() {
	const { data, isLoading } = useGetOverview()

	return (
		<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			<StatCard
				title='Tổng bệnh nhân'
				value={formatNumber(data?.totalPatients)}
				icon={Users}
				description={`+${formatNumber(data?.newPatientsThisMonth)} tháng này`}
				isLoading={isLoading}
			/>
			<StatCard
				title='Doanh thu tháng này'
				value={formatVND(data?.totalRevenueThisMonth)}
				icon={Wallet}
				isLoading={isLoading}
			/>
			<StatCard
				title='Đăng ký đang hoạt động'
				value={formatNumber(data?.activeSubscriptions)}
				icon={CreditCard}
				description={`${formatNumber(data?.activeStandardPackageUsers)} gói | ${formatNumber(data?.activePersonalizedCourseUsers)} khóa`}
				isLoading={isLoading}
			/>
			<StatCard
				title='Lịch hẹn hôm nay'
				value={formatNumber(data?.appointmentsToday)}
				icon={CalendarCheck}
				description={`Hoàn thành: ${formatPercent(data?.overallCompletionRate)}`}
				isLoading={isLoading}
			/>
		</div>
	)
}
