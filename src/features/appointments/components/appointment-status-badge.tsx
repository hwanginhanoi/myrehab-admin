import { Badge } from '@/components/ui/badge'
import { appointmentStatusConfig, type AppointmentStatus } from '@/lib/appointment-utils'

type AppointmentStatusBadgeProps = {
  status?: string
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const config = appointmentStatusConfig[status as AppointmentStatus]
  if (!config) return <Badge variant='outline'>{status ?? 'N/A'}</Badge>

  return (
    <Badge variant={config.variant} className='gap-1'>
      <span className={`size-1.5 rounded-full ${config.color}`} />
      {config.label}
    </Badge>
  )
}
