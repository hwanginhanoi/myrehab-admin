import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useConfirmAppointment, useMarkComplete, type AppointmentResponse } from '@/api'
import { RejectDialog } from '@/features/appointment-detail/components/reject-dialog'

type DoctorAppointmentActionsProps = {
  appointment: AppointmentResponse
}

export function DoctorAppointmentActions({ appointment }: DoctorAppointmentActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/doctor/my-appointments' }] })
  }

  const confirmAppointment = useConfirmAppointment({
    mutation: {
      onSuccess: () => {
        toast.success('Đã xác nhận lịch hẹn')
        invalidate()
      },
      onError: () => toast.error('Có lỗi xảy ra'),
    },
  })

  const markComplete = useMarkComplete({
    mutation: {
      onSuccess: () => {
        toast.success('Đã đánh dấu hoàn thành')
        invalidate()
      },
      onError: () => toast.error('Có lỗi xảy ra'),
    },
  })

  const isPending = confirmAppointment.isPending || markComplete.isPending

  if (appointment.status === 'PENDING_CONFIRMATION') {
    return (
      <>
        <div className='flex gap-2'>
          <Button
            size='sm'
            onClick={() => confirmAppointment.mutate({ id: appointment.id! })}
            disabled={isPending}
          >
            Xác nhận
          </Button>
          <Button
            size='sm'
            variant='destructive'
            onClick={() => setRejectOpen(true)}
            disabled={isPending}
          >
            Từ chối
          </Button>
        </div>
        <RejectDialog
          appointmentId={appointment.id!}
          open={rejectOpen}
          onOpenChange={setRejectOpen}
        />
      </>
    )
  }

  if (appointment.status === 'CONFIRMED') {
    return (
      <Button
        size='sm'
        onClick={() => markComplete.mutate({ id: appointment.id! })}
        disabled={isPending}
      >
        Hoàn thành
      </Button>
    )
  }

  return null
}
