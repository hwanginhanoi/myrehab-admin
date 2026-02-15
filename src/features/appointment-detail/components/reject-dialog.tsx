import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useRejectAppointment } from '@/api'

const formSchema = z.object({
  rejectionReason: z.string().min(1, 'Lý do từ chối là bắt buộc'),
})

type FormValues = z.infer<typeof formSchema>

type RejectDialogProps = {
  appointmentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RejectDialog({
  appointmentId,
  open,
  onOpenChange,
}: RejectDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { rejectionReason: '' },
  })

  const rejectAppointment = useRejectAppointment({
    mutation: {
      onSuccess: () => {
        toast.success('Đã từ chối lịch hẹn')
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/:id', params: { id: appointmentId } }] })
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/admin/all' }] })
        onOpenChange(false)
        form.reset()
      },
      onError: () => {
        toast.error('Có lỗi xảy ra')
      },
    },
  })

  function onSubmit(values: FormValues) {
    rejectAppointment.mutate({
      id: appointmentId,
      data: { rejectionReason: values.rejectionReason },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Từ chối lịch hẹn</DialogTitle>
          <DialogDescription>
            Hãy cung cấp lý do từ chối lịch hẹn này. Bệnh nhân sẽ được hoàn tiền tự động.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='rejectionReason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do từ chối</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Nhập lý do từ chối...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit' variant='destructive' disabled={rejectAppointment.isPending}>
                {rejectAppointment.isPending ? 'Đang xử lý...' : 'Từ chối'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
