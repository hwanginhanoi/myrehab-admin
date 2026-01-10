import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, UserPen, UserCheck, UserX } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { StaffResponse } from '@/api'
import { useEnableStaff, useDisableStaff } from '@/api'
import { useStaff } from './staff-provider'

type StaffRowActionsProps = {
  row: Row<StaffResponse>
}

export function StaffRowActions({ row }: StaffRowActionsProps) {
  const { setOpen, setCurrentRow } = useStaff()
  const queryClient = useQueryClient()

  const enableStaffMutation = useEnableStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        toast.success('Đã kích hoạt nhân viên')
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể kích hoạt nhân viên')
      },
    },
  })

  const disableStaffMutation = useDisableStaff({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/admin/staff' }] })
        toast.success('Đã vô hiệu hóa nhân viên')
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể vô hiệu hóa nhân viên')
      },
    },
  })

  const handleToggleStatus = () => {
    const staffId = row.original.id
    if (!staffId) return

    if (row.original.enabled) {
      disableStaffMutation.mutate({ id: staffId })
    } else {
      enableStaffMutation.mutate({ id: staffId })
    }
  }

  return (
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
      <DropdownMenuContent align='end' className='w-[180px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          Chỉnh sửa
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus}>
          {row.original.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
          <DropdownMenuShortcut>
            {row.original.enabled ? (
              <UserX size={16} />
            ) : (
              <UserCheck size={16} />
            )}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-red-500!'
        >
          Xóa
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
