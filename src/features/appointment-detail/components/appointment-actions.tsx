import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppointmentResponse } from '@/api'
import { getAvailableActions } from '@/lib/appointment-utils'
import { AssignDoctorDialog } from './assign-doctor-dialog'
import { ConfirmDialog } from './confirm-dialog'
import { RejectDialog } from './reject-dialog'
import { DisputeResolutionDialog } from './dispute-resolution-dialog'
import { useConfirmCompletion } from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type AppointmentActionsProps = {
  appointment: AppointmentResponse
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const actions = getAvailableActions(appointment.status)
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const confirmCompletion = useConfirmCompletion({
    mutation: {
      onSuccess: () => {
        toast.success('Đã xác nhận hoàn thành')
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/:id', params: { id: appointment.id } }] })
        queryClient.invalidateQueries({ queryKey: [{ url: '/api/appointments/admin/all' }] })
      },
      onError: () => {
        toast.error('Có lỗi xảy ra')
      },
    },
  })

  if (actions.length === 0) return null

  const actionLabels: Record<string, string> = {
    assign_doctor: 'Phân công bác sĩ',
    confirm: 'Xác nhận lịch hẹn',
    reject: 'Từ chối',
    confirm_completion: 'Xác nhận hoàn thành',
    resolve_dispute: 'Giải quyết tranh chấp',
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hành động</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-2'>
          {actions.map((action) => (
            <Button
              key={action}
              variant={action === 'reject' ? 'destructive' : 'default'}
              onClick={() => {
                if (action === 'confirm_completion') {
                  confirmCompletion.mutate({ id: appointment.id! })
                } else {
                  setOpenDialog(action)
                }
              }}
              disabled={confirmCompletion.isPending}
            >
              {actionLabels[action]}
            </Button>
          ))}
        </CardContent>
      </Card>

      <AssignDoctorDialog
        appointmentId={appointment.id!}
        open={openDialog === 'assign_doctor'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <ConfirmDialog
        appointmentId={appointment.id!}
        open={openDialog === 'confirm'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <RejectDialog
        appointmentId={appointment.id!}
        open={openDialog === 'reject'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
      <DisputeResolutionDialog
        appointmentId={appointment.id!}
        open={openDialog === 'resolve_dispute'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
    </>
  )
}
