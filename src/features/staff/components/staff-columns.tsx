import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import type { StaffResponse } from '@/api'
import { staffRoles, statusColors } from '../data/staff-roles'
import { StaffRowActions } from './staff-row-actions'

export const staffColumns: ColumnDef<StaffResponse>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Họ và tên' />
    ),
    cell: ({ row }) => (
      <div className='ps-3 font-medium'>{row.getValue('fullName')}</div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'staffType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vai trò' />
    ),
    cell: ({ row }) => {
      const staffType = row.getValue('staffType') as string
      const role = staffRoles.find(({ value }) => value === staffType)

      if (!role) {
        return null
      }

      return (
        <div className='flex items-center gap-x-2'>
          {role.icon && (
            <role.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm'>{role.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'enabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const enabled = row.getValue('enabled') as boolean
      const status = enabled ? 'active' : 'inactive'
      const badgeColor = statusColors.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {enabled ? 'Hoạt động' : 'Vô hiệu hóa'}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const enabled = row.getValue(id) as boolean
      const status = enabled ? 'active' : 'inactive'
      return value.includes(status)
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return date ? format(new Date(date), 'dd/MM/yyyy') : '-'
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: StaffRowActions,
  },
]
