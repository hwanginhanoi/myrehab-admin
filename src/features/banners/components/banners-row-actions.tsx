import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Eye, Pencil, Power, PowerOff } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type BannerResponse, useUpdateBanner } from '@/api'

type BannersRowActionsProps = {
  row: Row<BannerResponse>
}

export function BannersRowActions({ row }: BannersRowActionsProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const updateMutation = useUpdateBanner({
    mutation: {
      onSuccess: () => {
        toast.success(row.original.isActive ? 'Đã tắt banner' : 'Đã bật banner')
        void queryClient.invalidateQueries({ queryKey: [{ url: '/api/banners' }] })
      },
      onError: (error) => {
        toast.error('Thao tác thất bại: ' + error.message)
      },
    },
  })

  const handleToggleStatus = () => {
    const banner = row.original
    if (!banner.id) return

    updateMutation.mutate({
      id: banner.id,
      data: {
        title: banner.title || '',
        description: banner.description,
        linkUrl: banner.linkUrl,
        displayOrder: banner.displayOrder || 0,
        imageUrl: banner.imageUrl || '',
        isActive: !banner.isActive,
        startDate: banner.startDate,
        endDate: banner.endDate,
      },
    })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/banners/$id',
                params: { id: String(row.original.id) },
                search: { mode: 'view' },
              })
            }}
          >
            Xem chi tiết
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/banners/$id',
                params: { id: String(row.original.id) },
                search: { mode: 'edit' },
              })
            }}
          >
            Chỉnh sửa
            <DropdownMenuShortcut>
              <Pencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleToggleStatus}
            disabled={updateMutation.isPending}
          >
            {row.original.isActive ? 'Tắt' : 'Bật'}
            <DropdownMenuShortcut>
              {row.original.isActive ? <PowerOff size={16} /> : <Power size={16} />}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
