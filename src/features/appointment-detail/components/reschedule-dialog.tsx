import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/date-picker'
import client from '@/lib/api-client'
import { useGetAvailableSlots } from '@/api/hooks/AppointmentsHooks/useGetAvailableSlots'
import { useGetPublicDoctors } from '@/api/hooks/AppointmentsHooks/useGetPublicDoctors'

const formSchema = z.object({
  appointmentDate: z.date({ error: 'Vui lòng chọn ngày' }),
  startTime: z.string().min(1, 'Vui lòng chọn giờ'),
  doctorId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type RescheduleDialogProps = {
  appointmentId: number
  currentDoctorId?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RescheduleDialog({
  appointmentId,
  currentDoctorId,
  open,
  onOpenChange,
}: RescheduleDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentDate: undefined,
      startTime: '',
      doctorId:
        currentDoctorId != null && !Number.isNaN(currentDoctorId)
          ? String(currentDoctorId)
          : undefined,
    },
  })

  const selectedDate = form.watch('appointmentDate')
  const selectedDoctorId = form.watch('doctorId')
  const effectiveDoctorId = selectedDoctorId
    ? Number(selectedDoctorId)
    : currentDoctorId

  useEffect(() => {
    if (!open) return

    form.reset({
      appointmentDate: undefined,
      startTime: '',
      doctorId:
        currentDoctorId != null && !Number.isNaN(currentDoctorId)
          ? String(currentDoctorId)
          : undefined,
    })
  }, [open, currentDoctorId, form])

  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''

  const { data: slots = [] } = useGetAvailableSlots(
    {
      date: dateString,
      ...(effectiveDoctorId ? { doctorId: effectiveDoctorId } : {}),
    },
    {
      query: {
        enabled: !!dateString,
      },
    }
  )

  const { data: doctors = [] } = useGetPublicDoctors()

  const hasSlots = slots.length > 0

  const reschedule = useMutation({
    mutationFn: async (values: FormValues) => {
      const body: Record<string, unknown> = {
        appointmentDate: format(values.appointmentDate, 'yyyy-MM-dd'),
        startTime: values.startTime + ':00',
      }
      if (values.doctorId) {
        body.doctorId = Number(values.doctorId)
      }
      const response = await client<unknown>({
        method: 'PATCH',
        url: `/api/appointments/${appointmentId}/reschedule`,
        data: body,
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Đã dời lịch hẹn thành công')
      queryClient.invalidateQueries({
        queryKey: [
          { url: '/api/appointments/:id', params: { id: appointmentId } },
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [{ url: '/api/appointments/admin/all' }],
      })
      onOpenChange(false)
      form.reset()
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi dời lịch hẹn')
    },
  })

  function onSubmit(values: FormValues) {
    reschedule.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dời lịch hẹn</DialogTitle>
          <DialogDescription>
            Thay đổi ngày, giờ hoặc bác sĩ phụ trách. Chỉ áp dụng cho lịch hẹn
            đang chờ xác nhận.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Doctor selector */}
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bác sĩ (không bắt buộc)</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      form.setValue('startTime', '')
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bác sĩ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={String(doctor.id)}>
                          {doctor.fullName}
                          {doctor.specialization
                            ? ` — ${doctor.specialization}`
                            : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date picker */}
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày hẹn mới</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        form.setValue('startTime', '')
                      }}
                      placeholder="Chọn ngày"
                      disablePast
                      modal
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time slot picker */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khung giờ</FormLabel>
                  {!dateString ? (
                    <p className="text-muted-foreground text-sm">
                      Chọn ngày trước để xem khung giờ trống
                    </p>
                  ) : !hasSlots ? (
                    <p className="text-muted-foreground text-sm">
                      Không có khung giờ trống cho ngày này
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => {
                        const value = slot.startTime?.slice(0, 5) ?? ''
                        const isSelected = field.value === value
                        const isAvailable = slot.available !== false
                        return (
                          <button
                            key={slot.startTime}
                            type="button"
                            onClick={() => {
                              if (!isAvailable) return
                              field.onChange(value)
                            }}
                            disabled={!isAvailable}
                            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : isAvailable
                                  ? 'border-input hover:bg-accent'
                                  : 'border-input bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                            }`}
                          >
                            {slot.startTime?.slice(0, 5)}
                            {slot.endTime
                              ? ` – ${slot.endTime.slice(0, 5)}`
                              : ''}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={reschedule.isPending}>
                {reschedule.isPending ? 'Đang xử lý...' : 'Xác nhận dời lịch'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
