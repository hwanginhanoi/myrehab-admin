import { KpiCards } from './components/kpi-cards'
import { RevenueChart } from './components/revenue-chart'
import { RevenueBreakdown } from './components/revenue-breakdown'
import { PackageRevenueBreakdown } from './components/package-revenue-breakdown'
import { TopSpendersTable } from './components/top-spenders-table'

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <KpiCards />

      <RevenueChart />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueBreakdown />
        <PackageRevenueBreakdown />
      </div>

      <TopSpendersTable />
    </div>
  )
}
