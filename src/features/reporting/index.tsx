import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useAuthStore } from '@/stores/auth-store'
import { OverviewTab } from './overview/overview-tab'
import { TransactionsTab } from './transactions/transactions-tab'
import { PatientsTab } from './patients/patients-tab'
import { PainAnalyticsTab } from './pain-analytics/pain-analytics-tab'

type TabDef = {
	id: string
	label: string
	roles: string[]
	component: React.ComponentType
}

const ALL_TABS: TabDef[] = [
	{
		id: 'overview',
		label: 'Tổng quan',
		roles: ['SUPER_ADMIN'],
		component: OverviewTab,
	},
	{
		id: 'transactions',
		label: 'Lịch sử giao dịch',
		roles: ['SUPER_ADMIN'],
		component: TransactionsTab,
	},
	{
		id: 'patients',
		label: 'Phục hồi chức năng',
		roles: ['SUPER_ADMIN'],
		component: PatientsTab,
	},
	{
		id: 'pain',
		label: 'Phản hồi & Đau',
		roles: ['SUPER_ADMIN'],
		component: PainAnalyticsTab,
	},
]

export function Reporting() {
	const { auth } = useAuthStore()
	const userType = auth.userType ?? ''

	const visibleTabs = useMemo(
		() => ALL_TABS.filter((tab) => tab.roles.includes(userType)),
		[userType]
	)

	const defaultTab = visibleTabs[0]?.id ?? 'overview'

	return (
		<>
			<Header fixed>
				<div className='ms-auto flex items-center space-x-4'>
					<ThemeSwitch />
					<ConfigDrawer />
					<ProfileDropdown />
				</div>
			</Header>

			<Main>
				<div className='mb-4 flex flex-wrap items-end justify-between gap-2'>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>
							Báo cáo & Thống kê
						</h1>
						<p className='text-muted-foreground'>
							Tổng quan hoạt động, doanh thu và hiệu quả phục hồi.
						</p>
					</div>
				</div>

				<Tabs defaultValue={defaultTab} className='space-y-6'>
					<div className='w-full overflow-x-auto pb-2'>
						<TabsList>
							{visibleTabs.map((tab) => (
								<TabsTrigger key={tab.id} value={tab.id}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{visibleTabs.map((tab) => (
						<TabsContent key={tab.id} value={tab.id}>
							<tab.component />
						</TabsContent>
					))}
				</Tabs>
			</Main>
		</>
	)
}
