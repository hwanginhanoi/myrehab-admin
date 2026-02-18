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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useResolveDispute } from '@/api'

const formSchema = z.object({
  resolution: z.enum(['APPROVE_DOCTOR', 'REFUND_PATIENT'], {
    message: 'Vui lòng chọn cách giải quyết',
  }),
  resolutionNotes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type DisputeResolutionDialogProps = {
  appointmentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DisputeResolutionDialog({
  appointmentId,
  open,
  onOpenChange,
}: DisputeResolutionDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      resolutionNotes: '',
    },
  })

  const resolveDispute = useResolveDispute({
    mutation: {
      onSuccess: () => {
        toast.success('Đã giải quyết tranh chấp')
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
    resolveDispute.mutate({
      id: appointmentId,
      data: {
        resolution: values.resolution,
        resolutionNotes: values.resolutionNotes || undefined,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Giải quyết tranh chấp</DialogTitle>
          <DialogDescription>
            Chọn cách giải quyết tranh chấp cho lịch hẹn này.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='resolution'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cách giải quyết</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn cách giải quyết' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='APPROVE_DOCTOR'>
                        Chấp nhận bác sĩ
                      </SelectItem>
                      <SelectItem value='REFUND_PATIENT'>
                        Hoàn tiền bệnh nhân
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='resolutionNotes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú giải quyết</FormLabel>
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
              <Button type='submit' disabled={resolveDispute.isPending}>
                {resolveDispute.isPending ? 'Đang xử lý...' : 'Giải quyết'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
