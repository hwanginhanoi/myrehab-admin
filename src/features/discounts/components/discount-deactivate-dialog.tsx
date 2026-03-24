import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  useDeactivate,
  getActiveDiscountsQueryKey,
  type DiscountResponse,
} from '@/api'
import { getPricingQueryKey } from '../hooks/use-get-pricing'

type DiscountDeactivateDialogProps = {
  open: boolean
  onOpenChange: () => void
  currentRow: DiscountResponse
}

export function DiscountDeactivateDialog({
  open,
  onOpenChange,
  currentRow,
}: DiscountDeactivateDialogProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useDeactivate({
    mutation: {
      onSuccess: () => {
        toast.success('Hủy kích hoạt giảm giá thành công')
        queryClient.invalidateQueries({
          queryKey: getPricingQueryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: getActiveDiscountsQueryKey(),
        })
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/discounts/history' }],
        })
        onOpenChange()
      },
    },
  })

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onOpenChange()
      }}
      title="Hủy kích hoạt giảm giá"
      desc={`Bạn có chắc chắn muốn hủy kích hoạt giảm giá ${currentRow.percentage}% không? Hành động này không thể hoàn tác.`}
      confirmText="Hủy kích hoạt"
      cancelBtnText="Đóng"
      destructive
      isLoading={isPending}
      handleConfirm={() => {
        if (currentRow.id) {
          mutate({ id: currentRow.id })
        }
      }}
    />
  )
}
