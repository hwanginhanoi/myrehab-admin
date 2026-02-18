import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { type GroupResponse } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { ExerciseGroupsTableRowActions } from './exercise-groups-table-row-actions'

export const exerciseGroupsColumns: ColumnDef<GroupResponse>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên nhóm' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('name') || '-'}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mô tả' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground truncate max-w-[300px]'>
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày thêm' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string | undefined
      return (
        <div>
          {createdAt ? format(new Date(createdAt), 'dd/MM/yyyy') : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Thao tác</div>,
    cell: ExerciseGroupsTableRowActions,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[100px]',
    },
  },
]
