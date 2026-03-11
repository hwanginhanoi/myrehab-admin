import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type StartupPopupResponse, useDeletePopup } from '@/api'

type StartupPopupsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: StartupPopupResponse
}

export function StartupPopupsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: StartupPopupsDeleteDialogProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useDeletePopup({
    mutation: {
      onSuccess: () => {
        toast.success('Xóa popup thành công')
        onOpenChange(false)
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/startup-popup' }],
        })
      },
      onError: (error) => {
        toast.error('Xóa popup thất bại: ' + error.message)
      },
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Xóa popup "${currentRow.title}"?`}
      desc="Popup sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn muốn tiếp tục?"
      confirmText="Xóa"
      cancelBtnText="Hủy"
      destructive
      isLoading={deleteMutation.isPending}
      handleConfirm={() => {
        if (currentRow.id) {
          deleteMutation.mutate({ id: currentRow.id })
        }
      }}
    />
  )
}
