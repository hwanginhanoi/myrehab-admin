import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { type UserResponse } from '@/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type UsersTableRowActionsProps = {
  row: Row<UserResponse>
}

export function UsersTableRowActions({ row }: UsersTableRowActionsProps) {
  const navigate = useNavigate()

  return (
    <div className='flex justify-end'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[180px]'>
          <DropdownMenuItem
            onClick={() => {
              navigate({ to: '/users/$id', params: { id: String(row.original.id) } })
            }}
          >
            Xem thông tin
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
