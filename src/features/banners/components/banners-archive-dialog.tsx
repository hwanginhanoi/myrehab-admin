import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type BannerResponse, useArchiveBanner } from '@/api'

type BannersArchiveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: BannerResponse
}

export function BannersArchiveDialog({
  open,
  onOpenChange,
  currentRow,
}: BannersArchiveDialogProps) {
  const queryClient = useQueryClient()

  const archiveMutation = useArchiveBanner({
    mutation: {
      onSuccess: () => {
        toast.success('Lưu trữ banner thành công')
        onOpenChange(false)
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/banners/all' }],
        })
      },
      onError: (error) => {
        toast.error('Lưu trữ banner thất bại: ' + error.message)
      },
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Lưu trữ banner "${currentRow.title}"?`}
      desc="Banner sẽ không còn hiển thị trên ứng dụng. Bạn có thể khôi phục lại sau."
      confirmText="Lưu trữ"
      cancelBtnText="Hủy"
      destructive
      isLoading={archiveMutation.isPending}
      handleConfirm={() => {
        if (currentRow.id) {
          archiveMutation.mutate({ id: currentRow.id })
        }
      }}
    />
  )
}
