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
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRemoveTrainerFromDoctor, type TrainerResponse } from '@/api'

type TrainerRemovalDialogProps = {
  doctorId: number
  trainer: TrainerResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TrainerRemovalDialog({
  doctorId,
  trainer,
  open,
  onOpenChange,
}: TrainerRemovalDialogProps) {
  const queryClient = useQueryClient()

  // Removal mutation
  const removeMutation = useRemoveTrainerFromDoctor({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: `/api/admin/doctors/${doctorId}/trainers` }],
        })
        toast.success('Đã xóa huấn luyện viên khỏi bác sĩ')
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể xóa huấn luyện viên')
      },
    },
  })

  const handleRemove = () => {
    if (!trainer?.id) return
    removeMutation.mutate({
      doctorId,
      trainerId: trainer.id,
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa huấn luyện viên</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-semibold text-foreground'>
              {trainer?.fullName || 'huấn luyện viên này'}
            </span>{' '}
            khỏi bác sĩ này? Huấn luyện viên sẽ không còn được liên kết với bác sĩ này nữa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeMutation.isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleRemove()
            }}
            disabled={removeMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {removeMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
