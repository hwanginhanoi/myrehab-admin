import { z } from 'zod'
import { useForm, type Resolver } from 'react-hook-form'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAssignDoctor } from '@/api'

const formSchema = z.object({
  doctorId: z.coerce.number().min(1, 'ID bác sĩ là bắt buộc'),
  adminNotes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type AssignDoctorDialogProps = {
  appointmentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignDoctorDialog({
  appointmentId,
  open,
  onOpenChange,
}: AssignDoctorDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      doctorId: 0,
      adminNotes: '',
    },
  })

  const assignDoctor = useAssignDoctor({
    mutation: {
      onSuccess: () => {
        toast.success('Đã phân công bác sĩ')
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/:id', params: { id: appointmentId } }] })
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/admin/all' }] })
        onOpenChange(false)
        form.reset()
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi phân công bác sĩ')
      },
    },
  })

  function onSubmit(values: FormValues) {
    assignDoctor.mutate({
      id: appointmentId,
      data: {
        doctorId: values.doctorId,
        adminNotes: values.adminNotes || undefined,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân công bác sĩ</DialogTitle>
          <DialogDescription>
            Chọn bác sĩ để phân công cho lịch hẹn này.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='doctorId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Bác sĩ</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Nhập ID bác sĩ' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='adminNotes'
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
              <Button type='submit' disabled={assignDoctor.isPending}>
                {assignDoctor.isPending ? 'Đang xử lý...' : 'Phân công'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
