import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  parseCourseDetails,
  type CourseRequest,
} from '@/features/course-requests/types'
import { CourseRequestStatusBadge } from '@/features/course-requests/components/course-request-status-badge'
import { DoctorCourseRequestsRowActions } from './data-table-row-actions'

export const doctorCourseRequestsColumns: ColumnDef<CourseRequest>[] = [
  {
    accessorKey: 'trainerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kỹ thuật viên" />
    ),
    cell: ({ row }) => (
      <div className="font-medium pl-3">
        {row.getValue('trainerName') || '-'}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'patientName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bệnh nhân" />
    ),
    cell: ({ row }) => (
      <div className="pl-3">{row.getValue('patientName') || '-'}</div>
    ),
  },
  {
    id: 'courseName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên khóa tập" />
    ),
    cell: ({ row }) => {
      const details = parseCourseDetails(row.original.courseDetails)
      return <div className="pl-3">{details.courseName || '-'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <div className="pl-3">
          <CourseRequestStatusBadge status={status} />
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string | undefined
      return (
        <div className="pl-3">
          {date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Hành động</div>,
    cell: DoctorCourseRequestsRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[80px]',
    },
  },
]
