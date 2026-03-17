import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { BannerResponse } from '@/api'
import { bannerStatusLabels, BannerStatus } from '@/lib/constants/banner-status'
import { DataTableRowActions } from './data-table-row-actions'

export const bannersColumns: ColumnDef<BannerResponse>[] = [
  {
    id: 'drag-handle',
    header: () => null,
    meta: {
      className: cn('w-10 max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: () => (
      <div className="drag-handle cursor-grab touch-none active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'order',
    header: () => <span className="text-muted-foreground">#</span>,
    meta: {
      className: cn('w-10'),
    },
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.index + 1}</span>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'imageUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ảnh" />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue('imageUrl') as string | undefined
      return imageUrl ? (
        <img
          src={imageUrl}
          alt={row.original.title ?? ''}
          className="h-12 w-20 rounded object-cover"
        />
      ) : (
        <div className="flex h-12 w-20 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
          No image
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiêu đề" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-48 ps-3 font-medium">
        {row.original.title ?? ''}
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const isDraft = row.original.id === -1
      if (isDraft) {
        return (
          <div className="flex space-x-2">
            <Badge variant="outline" className="border-primary text-primary">
              Nháp
            </Badge>
          </div>
        )
      }
      const status = row.getValue('status') as keyof typeof bannerStatusLabels
      const label = bannerStatusLabels[status] || status
      return (
        <div className="flex space-x-2">
          <Badge
            variant={
              status === BannerStatus.ACTIVE
                ? 'default'
                : status === BannerStatus.INACTIVE
                  ? 'secondary'
                  : 'outline'
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
    id: 'actions',
    cell: DataTableRowActions,
  },
]
