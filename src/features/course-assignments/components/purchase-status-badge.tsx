import { Badge } from '@/components/ui/badge'
import { purchaseStatusConfig, type PurchaseStatus } from '@/lib/course-assignment-utils'

type PurchaseStatusBadgeProps = {
  status: PurchaseStatus | undefined
}

export function PurchaseStatusBadge({ status }: PurchaseStatusBadgeProps) {
  if (!status) return <span className='text-muted-foreground'>-</span>

  const config = purchaseStatusConfig[status]
  if (!config) return <span className='text-muted-foreground'>-</span>

  return (
    <Badge variant={config.variant} className='flex items-center gap-1.5 w-fit'>
      <div className={`size-2 rounded-full ${config.color}`} />
      {config.label}
    </Badge>
  )
}
