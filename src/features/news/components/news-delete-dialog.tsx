'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type NewsResponse, useDeleteNews } from '@/api'
import { toast } from 'sonner'

type NewsDeleteDialogProps = {
  currentRow?: NewsResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewsDeleteDialog({
  currentRow,
  open,
  onOpenChange,
}: NewsDeleteDialogProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useDeleteNews({
    mutation: {
      onSuccess: () => {
        toast.success('Xóa tin tức thành công')
        onOpenChange(false)
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/news' }] })
      },
      onError: (error) => {
        toast.error('Xóa tin tức thất bại: ' + error.message)
      },
    },
  })

  const handleDelete = () => {
    if (currentRow?.id) {
      deleteMutation.mutate({ id: currentRow.id })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Tin tức "{currentRow?.title}" sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
