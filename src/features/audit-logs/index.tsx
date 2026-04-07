import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useAuditLogs, type AuditLogsParams } from './api'
import { AuditLogsTable } from './components/audit-logs-table'

const route = getRouteApi('/_authenticated/admin/audit-logs/')

export function AuditLogs() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const page = search.page || 1
  const pageSize = search.pageSize || 20

  const queryParams = useMemo<AuditLogsParams>(
    () => ({
      page: page - 1,
      size: pageSize,
      ...(search.action && { action: search.action }),
      ...(search.entityType && { entityType: search.entityType }),
      ...(search.from && { from: `${search.from}T00:00:00` }),
      ...(search.to && { to: `${search.to}T23:59:59` }),
    }),
    [page, pageSize, search.action, search.entityType, search.from, search.to]
  )

  const { data: response, isLoading } = useAuditLogs(queryParams)

  const logs = response?.content || []
  const totalPages = response?.page?.totalPages || 0

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Nhật ký hoạt động
            </h2>
            <p className="text-muted-foreground">
              Theo dõi tất cả hoạt động trong hệ thống.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <AuditLogsTable
            data={logs}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>
    </>
  )
}
