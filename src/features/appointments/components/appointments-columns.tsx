import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import type { AppointmentResponse } from '@/api'
import { formatLocalTime } from '@/lib/appointment-utils'
import { AppointmentStatusBadge } from './appointment-status-badge'
import { AppointmentsRowActions } from './appointments-row-actions'
import { Badge } from '@/components/ui/badge'

// Extend AppointmentResponse with fields pending API regeneration
type AppointmentRow = AppointmentResponse & {
  appointmentType?: 'ONLINE' | 'OFFLINE'
  userPhoneNumber?: string
}

export const appointmentsColumns: ColumnDef<AppointmentRow>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-10">#{row.getValue('id')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bệnh nhân" />
    ),
    cell: ({ row }) => (
      <div className="max-w-32 truncate font-medium">
        {row.getValue('userName') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'userPhoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SĐT bệnh nhân" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue('userPhoneNumber') || '-'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'doctorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bác sĩ" />
    ),
    cell: ({ row }) => (
      <div className="max-w-32 truncate">
        {row.getValue('doctorName') || 'Chưa phân công'}
      </div>
    ),
  },
  {
    accessorKey: 'appointmentDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày" />
    ),
    cell: ({ row }) => <div>{row.getValue('appointmentDate') || '-'}</div>,
  },
  {
    id: 'time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thời gian" />
    ),
    cell: ({ row }) => (
      <div>
        {formatLocalTime(row.original.startTime)} -{' '}
        {formatLocalTime(row.original.endTime)}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => (
      <AppointmentStatusBadge status={row.getValue('status')} />
    ),
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'appointmentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại" />
    ),
    cell: ({ row }) => {
      const type = row.getValue<string>('appointmentType')
      if (!type) return <div>-</div>
      return type === 'ONLINE' ? (
        <Badge variant="secondary">Trực tuyến</Badge>
      ) : (
        <Badge variant="outline">Trực tiếp</Badge>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: AppointmentsRowActions,
  },
]
