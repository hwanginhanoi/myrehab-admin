import { type Row } from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { RehabilitationExaminationFormResponse } from '@/api'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const form = row.original as RehabilitationExaminationFormResponse
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() =>
            navigate({
              to: '/rehabilitation-forms/$id',
              params: { id: String(form.id) },
              search: { mode: 'view' },
            })
          }
        >
          <Eye className='me-2 h-4 w-4' />
          Xem
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigate({
              to: '/rehabilitation-forms/$id',
              params: { id: String(form.id) },
              search: { mode: 'edit' },
            })
          }
        >
          <Pencil className='me-2 h-4 w-4' />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='text-destructive focus:text-destructive'>
          <Trash2 className='me-2 h-4 w-4' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
