import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { getPublicImageUrl } from '@/lib/file-upload'
import type { BannerResponse } from '@/api'
import { BannersRowActions } from './banners-row-actions'

function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

export const bannersColumns: ColumnDef<BannerResponse>[] = [
  {
    accessorKey: 'imageUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hình ảnh' />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue('imageUrl') as string | undefined
      if (!imageUrl) {
        return <div className='w-20 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground'>No image</div>
      }
      const publicUrl = getPublicImageUrl(imageUrl)
      return (
        <img
          src={publicUrl}
          alt={row.original.title || 'Banner'}
          className='w-20 h-12 object-cover rounded'
        />
      )
    },
    enableSorting: false,
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
    accessorKey: 'displayOrder',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thứ tự' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('displayOrder') ?? '-'}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Đang hiển thị' : 'Đã tắt'}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    id: 'schedule',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thời gian' />
    ),
    cell: ({ row }) => {
      const startDate = row.original.startDate
      const endDate = row.original.endDate

      if (!startDate && !endDate) {
        return <span className='text-muted-foreground'>Vô thời hạn</span>
      }

      return (
        <div className='text-sm'>
          <div>{formatDate(startDate)} - {formatDate(endDate)}</div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <BannersRowActions row={row} />,
  },
]
