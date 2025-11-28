import { Badge } from '@/components/ui/badge';
import { Building2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppointmentType } from '@/types/appointments';

interface AppointmentTypeBadgeProps {
  type: AppointmentType;
  className?: string;
  showIcon?: boolean;
}

const typeConfig: Record<
  AppointmentType,
  { icon: typeof Building2; label: { vi: string; en: string }; className: string }
> = {
  IN_PERSON: {
    icon: Building2,
    label: { vi: 'Trực tiếp', en: 'In-Person' },
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
  },
  ONLINE: {
    icon: Video,
    label: { vi: 'Trực tuyến', en: 'Online' },
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-200',
  },
};

export function AppointmentTypeBadge({ type, className, showIcon = true }: AppointmentTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label.vi}
    </Badge>
  );
}
