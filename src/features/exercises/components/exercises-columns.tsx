import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { ExerciseResponse } from '@/api'
import { DataTableRowActions } from './data-table-row-actions'

export const exercisesColumns: ColumnDef<ExerciseResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên bài tập' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3 font-medium'>{row.getValue('title')}</LongText>
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
    accessorKey: 'categories',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    cell: ({ row }) => {
      const categories = row.original.categories || []
      return (
        <div className='flex flex-wrap gap-1'>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Badge key={category.id} variant='outline' className='text-xs'>
                {category.name}
              </Badge>
            ))
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'groups',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho bài tập' />
    ),
    cell: ({ row }) => {
      const groups = row.original.groups || []
      return (
        <div className='flex flex-wrap gap-1'>
          {groups.length > 0 ? (
            groups.map((group) => (
              <Badge key={group.id} variant='secondary' className='text-xs'>
                {group.name}
              </Badge>
            ))
          ) : (
            <span className='text-muted-foreground'>-</span>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'durationMinutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thời lượng (phút)' />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('durationMinutes') || '-'}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mô tả' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-96'>{row.getValue('description') || '-'}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
