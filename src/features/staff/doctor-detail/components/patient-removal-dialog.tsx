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
import { useRemovePatientFromDoctor, type DoctorPatientResponse } from '@/api'

type PatientRemovalDialogProps = {
  doctorId: number
  patient: DoctorPatientResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientRemovalDialog({
  doctorId,
  patient,
  open,
  onOpenChange,
}: PatientRemovalDialogProps) {
  const queryClient = useQueryClient()

  // Removal mutation
  const removeMutation = useRemovePatientFromDoctor({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/admin/doctors/:doctorId/patients', params: { doctorId } }],
        })
        toast.success('Đã xóa bệnh nhân khỏi bác sĩ')
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể xóa bệnh nhân')
      },
    },
  })

  const handleRemove = () => {
    if (!patient?.userId) return
    removeMutation.mutate({
      doctorId,
      userId: patient.userId,
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa bệnh nhân</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-semibold text-foreground'>
              {patient?.userPhoneNumber || `Bệnh nhân #${patient?.userId}` || 'bệnh nhân này'}
            </span>{' '}
            khỏi bác sĩ này? Bệnh nhân sẽ không còn được liên kết với bác sĩ này nữa.
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
