import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { ExercisePackageResponse } from '@/api'
import { DataTableRowActions } from './data-table-row-actions'

export const exercisePackagesColumns: ColumnDef<ExercisePackageResponse>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên gói bài tập" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-48 ps-3 font-medium">
        {row.getValue('title')}
      </LongText>
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
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-96">
        {row.getValue('description') || '-'}
      </LongText>
    ),
    enableSorting: false,
  },
  {
    id: 'categories',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Danh mục" />
    ),
    cell: ({ row }) => {
      const categories = row.original.categories
      if (!categories || categories.length === 0) return <span>-</span>
      return (
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 3).map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'exerciseCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số bài tập" />
    ),
    cell: ({ row }) => <div>{row.original.exerciseCount || 0}</div>,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
