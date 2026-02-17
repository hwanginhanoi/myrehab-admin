import { useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { ClinicScheduleResponse } from '@/api'
import { useUpdateClinicSchedule } from '@/api'
import { formatLocalTime, parseTimeString, dayOfWeekLabels } from '@/lib/appointment-utils'

const formSchema = z.object({
  isOpen: z.boolean(),
  openingTime: z.string().min(1, 'Giờ mở cửa là bắt buộc'),
  closingTime: z.string().min(1, 'Giờ đóng cửa là bắt buộc'),
  slotDurationMinutes: z.coerce.number().min(1, 'Thời lượng slot phải > 0'),
})

type FormValues = z.infer<typeof formSchema>

type EditScheduleDialogProps = {
  schedule: ClinicScheduleResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditScheduleDialog({
  schedule,
  open,
  onOpenChange,
}: EditScheduleDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isOpen: true,
      openingTime: '08:00',
      closingTime: '17:00',
      slotDurationMinutes: 30,
    },
  })

  useEffect(() => {
    if (schedule) {
      form.reset({
        isOpen: schedule.isOpen ?? true,
        openingTime: formatLocalTime(schedule.openingTime),
        closingTime: formatLocalTime(schedule.closingTime),
        slotDurationMinutes: schedule.slotDurationMinutes ?? 30,
      })
    }
  }, [schedule, form])

  const updateSchedule = useUpdateClinicSchedule({
    mutation: {
      onSuccess: () => {
        toast.success('Đã cập nhật lịch phòng khám')
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/clinic-schedule' }] })
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Có lỗi xảy ra')
      },
    },
  })

  function onSubmit(values: FormValues) {
    if (!schedule?.dayOfWeek) return
    updateSchedule.mutate({
      data: {
        dayOfWeek: schedule.dayOfWeek,
        isOpen: values.isOpen,
        openingTime: parseTimeString(values.openingTime),
        closingTime: parseTimeString(values.closingTime),
        slotDurationMinutes: values.slotDurationMinutes,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Chỉnh sửa lịch - {dayOfWeekLabels[schedule?.dayOfWeek || ''] || ''}
          </DialogTitle>
          <DialogDescription>
            Cập nhật giờ hoạt động và thời lượng slot.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='isOpen'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-3'>
                  <FormLabel>Mở cửa</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='openingTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ mở cửa</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='closingTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giờ đóng cửa</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='slotDurationMinutes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng slot (phút)</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit' disabled={updateSchedule.isPending}>
                {updateSchedule.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
