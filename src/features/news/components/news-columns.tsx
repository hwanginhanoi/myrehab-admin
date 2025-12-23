import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { NewsResponse } from '@/api'
import { newsStatusLabels } from '@/lib/constants/news-status'
import { newsCategoryTypeLabels } from '@/lib/constants/news-catergories'
import { DataTableRowActions } from './data-table-row-actions'

export const newsColumns: ColumnDef<NewsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
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
      <DataTableColumnHeader column={column} title='Tiêu đề' />
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
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      const label = category ? newsCategoryTypeLabels[category as keyof typeof newsCategoryTypeLabels] || category : '-'
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className='capitalize'>
            {label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof newsStatusLabels
      const label = newsStatusLabels[status] || status
      return (
        <div className='flex space-x-2'>
          <Badge
            variant={
              status === 'PUBLISHED' ? 'default' :
              status === 'DRAFT' ? 'secondary' :
              'outline'
            }
          >
            {label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'summary',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tóm tắt' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-96'>{row.getValue('summary') || '-'}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
