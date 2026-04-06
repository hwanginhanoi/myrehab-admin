import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Eye, CalendarClock, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AppointmentResponse } from '@/api'
import { RescheduleDialog } from '@/features/appointment-detail/components/reschedule-dialog'
import { ConfirmDialog } from '@/features/appointment-detail/components/confirm-dialog'
import { RejectDialog } from '@/features/appointment-detail/components/reject-dialog'
import { usePermissions } from '@/hooks/use-permissions'
import { ALL_PERMISSIONS } from '@/features/staff/data/permissions'

type AppointmentsRowActionsProps = {
  row: Row<AppointmentResponse>
}

export function AppointmentsRowActions({ row }: AppointmentsRowActionsProps) {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()
  const [openDialog, setOpenDialog] = useState<
    'reschedule' | 'confirm' | 'reject' | null
  >(null)

  const appointment = row.original
  const status = appointment.status

  const canReschedule =
    status === 'PENDING_CONFIRMATION' &&
    hasPermission(ALL_PERMISSIONS.APPOINTMENTS_EDIT)

  const canConfirm =
    status === 'PENDING_CONFIRMATION' &&
    hasPermission(ALL_PERMISSIONS.APPOINTMENTS_CONFIRM)

  const canReject =
    status === 'PENDING_CONFIRMATION' &&
    hasPermission(ALL_PERMISSIONS.APPOINTMENTS_REJECT)

  const hasQuickActions = canReschedule || canConfirm || canReject

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            onClick={() =>
              navigate({
                to: '/appointments/$id',
                params: { id: String(appointment.id) },
              })
            }
          >
            Xem chi tiết
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {hasQuickActions && <DropdownMenuSeparator />}

          {canReschedule && (
            <DropdownMenuItem onClick={() => setOpenDialog('reschedule')}>
              Dời lịch hẹn
              <DropdownMenuShortcut>
                <CalendarClock size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {canConfirm && (
            <DropdownMenuItem onClick={() => setOpenDialog('confirm')}>
              Xác nhận
              <DropdownMenuShortcut>
                <CheckCircle size={16} className="text-green-600" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}

          {canReject && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setOpenDialog('reject')}
            >
              Từ chối
              <DropdownMenuShortcut>
                <XCircle size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {appointment.id != null && (
        <>
          <RescheduleDialog
            appointmentId={appointment.id}
            currentDoctorId={appointment.doctorId}
            open={openDialog === 'reschedule'}
            onOpenChange={(open) => !open && setOpenDialog(null)}
          />
          <ConfirmDialog
            appointmentId={appointment.id}
            open={openDialog === 'confirm'}
            onOpenChange={(open) => !open && setOpenDialog(null)}
          />
          <RejectDialog
            appointmentId={appointment.id}
            open={openDialog === 'reject'}
            onOpenChange={(open) => !open && setOpenDialog(null)}
          />
        </>
      )}
    </>
  )
}
