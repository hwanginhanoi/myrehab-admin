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
import { useConfirmAppointment } from '@/api'

const formSchema = z.object({
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type ConfirmDialogProps = {
  appointmentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfirmDialog({
  appointmentId,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: '' },
  })

  const confirmAppointment = useConfirmAppointment({
    mutation: {
      onSuccess: () => {
        toast.success('Đã xác nhận lịch hẹn')
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
    confirmAppointment.mutate({
      id: appointmentId,
      data: { notes: values.notes || undefined },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận lịch hẹn</DialogTitle>
          <DialogDescription>
            Xác nhận lịch hẹn này sẽ thông báo cho bệnh nhân.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Ghi chú thêm (không bắt buộc)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit' disabled={confirmAppointment.isPending}>
                {confirmAppointment.isPending ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
