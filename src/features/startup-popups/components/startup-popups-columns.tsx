import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import type { StartupPopupResponse } from '@/api'
import { DataTableRowActions } from './data-table-row-actions'

export const startupPopupsColumns: ColumnDef<StartupPopupResponse>[] = [
  {
    id: 'order',
    header: () => <span className="text-muted-foreground">#</span>,
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
          alt={row.getValue('title') as string}
          className="h-16 w-9 rounded object-cover"
        />
      ) : (
        <div className="flex h-16 w-9 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
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
        {row.getValue('title')}
      </LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('active') as boolean | undefined
      return (
        <div className="flex space-x-2">
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string | undefined
      if (!date) return null
      return (
        <span className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
