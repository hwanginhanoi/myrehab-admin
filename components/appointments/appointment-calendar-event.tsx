import { formatAppointmentTime } from '@/lib/utils/datetime';
import { cn } from '@/lib/utils';
import type { AppointmentStatus, AppointmentType } from '@/types/appointments';
import { Building2, Video } from 'lucide-react';

interface AppointmentCalendarEventProps {
  id: number;
  patientName: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  onClick?: () => void;
  className?: string;
}

const statusColorClasses: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200',
  APPROVED: 'bg-blue-100 border-[#6DBAD6] text-blue-900 hover:bg-blue-200',
  COMPLETED: 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200',
  REJECTED: 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200',
  CANCELLED: 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200',
};

export function AppointmentCalendarEvent({
  patientName,
  appointmentDateTime,
  status,
  type,
  onClick,
  className,
}: AppointmentCalendarEventProps) {
  const time = formatAppointmentTime(appointmentDateTime);
  const Icon = type === 'ONLINE' ? Video : Building2;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-2 py-1 rounded border text-xs mb-1 cursor-pointer transition-colors',
        statusColorClasses[status],
        className
      )}
    >
      <div className="flex items-center gap-1">
        <Icon className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium">{time}</span>
      </div>
      <div className="truncate">{patientName}</div>
    </button>
  );
}
