import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AuditLogs } from '@/features/audit-logs'

const auditLogsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  action: z.string().optional().catch(undefined),
  entityType: z.string().optional().catch(undefined),
  from: z.string().optional().catch(undefined),
  to: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/admin/audit-logs/')({
  beforeLoad: async () => {
    const { userType } = useAuthStore.getState()

    if (userType !== 'SUPER_ADMIN') {
      throw redirect({
        to: '/exercises',
        search: {
          categoryIds: [],
          groupIds: [],
        },
      })
    }
  },
  validateSearch: auditLogsSearchSchema,
  component: AuditLogs,
})
