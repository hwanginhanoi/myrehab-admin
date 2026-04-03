import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/api-client'
import type { AuditLogPageResponse } from './types'

export type AuditLogsParams = {
  entityType?: string
  action?: string
  actorId?: number
  from?: string
  to?: string
  page?: number
  size?: number
  sort?: string
}

export function useAuditLogs(params: AuditLogsParams = {}) {
  const { page = 0, size = 20, sort = 'createdAt,desc', ...filters } = params

  const queryParams: Record<string, unknown> = {
    page,
    size,
    sort,
  }

  if (filters.entityType) queryParams.entityType = filters.entityType
  if (filters.action) queryParams.action = filters.action
  if (filters.actorId) queryParams.actorId = filters.actorId
  if (filters.from) queryParams.from = filters.from
  if (filters.to) queryParams.to = filters.to

  return useQuery({
    queryKey: ['audit-logs', queryParams],
    queryFn: async () => {
      const response = await client<AuditLogPageResponse>({
        method: 'GET',
        url: '/api/admin/audit-logs',
        params: queryParams,
      })
      return response.data
    },
    placeholderData: (previousData) => previousData,
    refetchInterval: 30_000,
  })
}

export function useEntityAuditLogs(
  entityType: string,
  entityId: number,
  params: { size?: number } = {}
) {
  const { size = 10 } = params

  return useQuery({
    queryKey: ['audit-logs', 'entity', entityType, entityId, { size }],
    queryFn: async () => {
      const response = await client<AuditLogPageResponse>({
        method: 'GET',
        url: `/api/admin/audit-logs/entity/${entityType}/${entityId}`,
        params: { size },
      })
      return response.data
    },
    enabled: !!entityType && !!entityId,
  })
}
