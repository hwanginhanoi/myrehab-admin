import { ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useEntityAuditLogs } from '../api'
import { ACTION_LABELS, type AuditLogAction } from '../types'

type EntityAuditTimelineProps = {
  entityType: string
  entityId: number
}

export function EntityAuditTimeline({
  entityType,
  entityId,
}: EntityAuditTimelineProps) {
  const { userType } = useAuthStore()

  if (userType !== 'SUPER_ADMIN') return null

  return (
    <EntityAuditTimelineContent
      entityType={entityType}
      entityId={entityId}
    />
  )
}

function EntityAuditTimelineContent({
  entityType,
  entityId,
}: EntityAuditTimelineProps) {
  const { data, isLoading } = useEntityAuditLogs(entityType, entityId)
  const logs = data?.content || []

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 font-medium hover:bg-muted/50">
        <span>Lịch sử hoạt động</span>
        <ChevronDown className="size-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-x border-b rounded-b-lg p-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không có lịch sử hoạt động.
            </p>
          ) : (
            <div className="space-y-0">
              {logs.map((log) => {
                const actionConfig = ACTION_LABELS[log.action as AuditLogAction]
                return (
                  <div
                    key={log.id}
                    className="relative flex gap-3 pb-4 last:pb-0"
                  >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="mt-1.5 size-2.5 rounded-full bg-primary shrink-0" />
                      <div className="w-px flex-1 bg-border last:hidden" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        <span className="text-muted-foreground">
                          {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                        <span className="font-medium">{log.actorName}</span>
                        {actionConfig && (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${actionConfig.color}`}
                          >
                            {actionConfig.label}
                          </span>
                        )}
                      </div>
                      {log.description && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {log.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
