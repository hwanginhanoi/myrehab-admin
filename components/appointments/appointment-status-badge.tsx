import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/types/appointments';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig: Record<
  AppointmentStatus,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
  PENDING: {
    variant: 'default',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200',
  },
  APPROVED: {
    variant: 'default',
    className: 'bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90',
  },
  COMPLETED: {
    variant: 'default',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200',
  },
  REJECTED: {
    variant: 'destructive',
    className: '',
  },
  CANCELLED: {
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
  },
};

const statusLabels: Record<AppointmentStatus, { vi: string; en: string }> = {
  PENDING: { vi: 'Chờ duyệt', en: 'Pending' },
  APPROVED: { vi: 'Đã duyệt', en: 'Approved' },
  COMPLETED: { vi: 'Hoàn thành', en: 'Completed' },
  REJECTED: { vi: 'Đã từ chối', en: 'Rejected' },
  CANCELLED: { vi: 'Đã hủy', en: 'Cancelled' },
};

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const config = statusConfig[status];
  const label = statusLabels[status];

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {label.vi}
    </Badge>
  );
}
