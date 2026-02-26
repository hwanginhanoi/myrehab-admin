import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/data-table'
import { parseCourseDetails, type CourseRequest } from '../types'
import { CourseRequestStatusBadge } from './course-request-status-badge'
import { CourseRequestsRowActions } from './data-table-row-actions'

export const courseRequestsColumns: ColumnDef<CourseRequest>[] = [
  {
    accessorKey: 'patientName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bệnh nhân' />
    ),
    cell: ({ row }) => (
      <div className='font-medium pl-3'>{row.getValue('patientName') || '-'}</div>
    ),
    enableHiding: false,
  },
  {
    id: 'courseName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên khóa tập' />
    ),
    cell: ({ row }) => {
      const details = parseCourseDetails(row.original.courseDetails)
      return <div className='pl-3'>{details.courseName || '-'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const doctorNotes = row.original.doctorNotes
      return (
        <div className='pl-3 space-y-1'>
          <CourseRequestStatusBadge status={status} />
          {status === 'REJECTED' && doctorNotes && (
            <p className='text-xs text-red-600 line-clamp-1 max-w-[200px]'>{doctorNotes}</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string | undefined
      return (
        <div className='pl-3'>
          {date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'reviewedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày xét duyệt' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('reviewedAt') as string | undefined
      return (
        <div className='pl-3'>
          {date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Hành động</div>,
    cell: CourseRequestsRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[130px]',
    },
  },
]
