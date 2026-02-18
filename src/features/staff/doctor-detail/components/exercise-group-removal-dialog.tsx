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
import {
  useRemoveExerciseGroupFromDoctor,
  getExerciseGroupsByDoctorQueryKey,
  type GroupResponse,
} from '@/api'

type ExerciseGroupRemovalDialogProps = {
  doctorId: number
  group: GroupResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExerciseGroupRemovalDialog({
  doctorId,
  group,
  open,
  onOpenChange,
}: ExerciseGroupRemovalDialogProps) {
  const queryClient = useQueryClient()

  const removeMutation = useRemoveExerciseGroupFromDoctor({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getExerciseGroupsByDoctorQueryKey(doctorId),
        })
        toast.success('Đã xóa nhóm bài tập khỏi bác sĩ')
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể xóa nhóm bài tập')
      },
    },
  })

  const handleRemove = () => {
    if (!group?.id) return
    removeMutation.mutate({ doctorId, groupId: group.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa nhóm bài tập</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa nhóm bài tập{' '}
            <span className='font-semibold text-foreground'>
              {group?.name || 'này'}
            </span>{' '}
            khỏi bác sĩ này? Nhóm bài tập sẽ không còn được liên kết với bác sĩ này nữa.
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
