import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import type { AppointmentResponse } from '@/api'
import { formatLocalTime, formatCurrency } from '@/lib/appointment-utils'
import { AppointmentStatusBadge } from './appointment-status-badge'
import { AppointmentsRowActions } from './appointments-row-actions'

export const appointmentsColumns: ColumnDef<AppointmentResponse>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-10'>#{row.getValue('id')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bệnh nhân' />
    ),
    cell: ({ row }) => (
      <div className='max-w-32 truncate font-medium'>
        {row.getValue('userName') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'doctorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bác sĩ' />
    ),
    cell: ({ row }) => (
      <div className='max-w-32 truncate'>
        {row.getValue('doctorName') || 'Chưa phân công'}
      </div>
    ),
  },
  {
    accessorKey: 'appointmentDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày' />
    ),
    cell: ({ row }) => <div>{row.getValue('appointmentDate') || '-'}</div>,
  },
  {
    id: 'time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thời gian' />
    ),
    cell: ({ row }) => (
      <div>
        {formatLocalTime(row.original.startTime)} - {formatLocalTime(row.original.endTime)}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => <AppointmentStatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'fee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phí' />
    ),
    cell: ({ row }) => <div>{formatCurrency(row.getValue('fee'))}</div>,
  },
  {
    id: 'actions',
    cell: AppointmentsRowActions,
  },
]
