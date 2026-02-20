import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/server-data-table'
import type { CourseAssignmentDetail } from '../types'
import { formatDate } from '@/lib/course-assignment-utils'
import { PurchaseStatusBadge } from './purchase-status-badge'
import { ProgressBadge } from './progress-badge'
import { CourseAssignmentsRowActions } from './course-assignments-row-actions'

export const courseAssignmentsColumns: ColumnDef<CourseAssignmentDetail>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-10'>#{row.getValue('id')}</div>,
    enableHiding: false,
  },
  {
    id: 'patient',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Bệnh nhân' />,
    cell: ({ row }) => (
      <div className='max-w-40'>
        <div className='font-medium truncate'>{row.original.patientFullName || '-'}</div>
        <div className='text-muted-foreground text-sm truncate'>
          {row.original.patientPhoneNumber || '-'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'courseTitle',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Khóa tập' />,
    cell: ({ row }) => (
      <div className='max-w-48 truncate' title={row.getValue('courseTitle')}>
        {row.getValue('courseTitle') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'assignedByDoctorName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Bác sĩ phân công' />,
    cell: ({ row }) => (
      <div className='max-w-32 truncate'>{row.getValue('assignedByDoctorName') || '-'}</div>
    ),
  },
  {
    accessorKey: 'assignedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày phân công' />,
    cell: ({ row }) => <div>{formatDate(row.getValue('assignedAt'))}</div>,
  },
  {
    accessorKey: 'purchaseStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái thanh toán' />,
    cell: ({ row }) => <PurchaseStatusBadge status={row.getValue('purchaseStatus')} />,
    filterFn: (row, id, value) => {
      return Array.isArray(value) && value.includes(row.getValue(id))
    },
  },
  {
    id: 'progress',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiến độ' />,
    cell: ({ row }) => (
      <ProgressBadge hasStarted={row.original.hasStarted} isCompleted={row.original.isCompleted} />
    ),
  },
  {
    id: 'actions',
    cell: CourseAssignmentsRowActions,
  },
]
