import { KpiCards } from './components/kpi-cards'
import { RevenueChart } from './components/revenue-chart'
import { RevenueBreakdown } from './components/revenue-breakdown'
import { TopSpendersTable } from './components/top-spenders-table'

export function OverviewTab() {
	return (
		<div className='space-y-6'>
			<KpiCards />

			<div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
				<div className='lg:col-span-5'>
					<RevenueChart />
				</div>
				<div className='lg:col-span-2'>
					<RevenueBreakdown />
				</div>
			</div>

			<TopSpendersTable />
		</div>
	)
}
