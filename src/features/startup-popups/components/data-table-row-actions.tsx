import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Eye, Pencil, Power, Trash2 } from 'lucide-react'
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
import type { StartupPopupResponse } from '@/api'
import { useUpdatePopup } from '@/api'
import { usePermissions } from '@/hooks/use-permissions'
import { useStartupPopups } from './startup-popups-provider'

type DataTableRowActionsProps = {
  row: Row<StartupPopupResponse>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useStartupPopups()
  const { hasPermission } = usePermissions()
  const queryClient = useQueryClient()
  const canUpdate = hasPermission('startup-popups:update')
  const canDelete = hasPermission('startup-popups:delete')

  const toggleActiveMutation = useUpdatePopup()

  const handleToggleActive = () => {
    if (!row.original.id) return
    toggleActiveMutation.mutate(
      {
        id: row.original.id,
        data: {
          title: row.original.title || '',
          imageUrl: row.original.imageUrl || '',
          active: !row.original.active,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            row.original.active
              ? 'Đã tắt hiển thị popup'
              : 'Đã bật hiển thị popup'
          )
          queryClient.invalidateQueries({
            queryKey: [{ url: '/api/startup-popup' }],
          })
        },
        onError: (error) => {
          toast.error('Cập nhật thất bại: ' + error.message)
        },
      }
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('view')
          }}
        >
          Xem
          <DropdownMenuShortcut>
            <Eye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {canUpdate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('edit')
              }}
            >
              Chỉnh sửa
              <DropdownMenuShortcut>
                <Pencil size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleToggleActive}
              disabled={toggleActiveMutation.isPending}
            >
              {row.original.active ? 'Tắt hiển thị' : 'Bật hiển thị'}
              <DropdownMenuShortcut>
                <Power size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen('delete')
              }}
              className="text-destructive focus:text-destructive"
            >
              Xóa
              <DropdownMenuShortcut>
                <Trash2 size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
