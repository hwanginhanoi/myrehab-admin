import { useState } from 'react'
import {
  UserPlus,
  CheckCircle,
  XCircle,
  ClipboardCheck,
  Scale,
  CalendarClock,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useConfirmCompletion, type AppointmentResponse } from '@/api'
import { getAvailableActions } from '@/lib/appointment-utils'
import { AssignDoctorDialog } from './assign-doctor-dialog'
import { ConfirmDialog } from './confirm-dialog'
import { RejectDialog } from './reject-dialog'
import { DisputeResolutionDialog } from './dispute-resolution-dialog'
import { RescheduleDialog } from './reschedule-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { ALL_PERMISSIONS } from '@/features/staff/data/permissions'

type AppointmentActionsProps = {
  appointment: AppointmentResponse
}

type ActionConfig = {
  key: string
  label: string
  description: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  buttonLabel: string
  buttonVariant: 'default' | 'destructive' | 'outline' | 'secondary'
  group: 'primary' | 'danger'
  inline?: boolean
}

const actionConfigs: ActionConfig[] = [
  {
    key: 'assign_doctor',
    label: 'Phân công bác sĩ',
    description: 'Chỉ định bác sĩ phụ trách lịch hẹn này',
    icon: <UserPlus className="h-4 w-4" />,
    iconBg: 'bg-blue-100 dark:bg-blue-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
    buttonLabel: 'Phân công',
    buttonVariant: 'outline',
    group: 'primary',
  },
  {
    key: 'reschedule',
    label: 'Dời lịch hẹn',
    description: 'Thay đổi ngày, giờ hoặc bác sĩ (chỉ khi chờ xác nhận)',
    icon: <CalendarClock className="h-4 w-4" />,
    iconBg: 'bg-purple-100 dark:bg-purple-950',
    iconColor: 'text-purple-600 dark:text-purple-400',
    buttonLabel: 'Dời lịch',
    buttonVariant: 'outline',
    group: 'primary',
  },
  {
    key: 'confirm',
    label: 'Xác nhận lịch hẹn',
    description: 'Phê duyệt và thông báo đến bệnh nhân',
    icon: <CheckCircle className="h-4 w-4" />,
    iconBg: 'bg-green-100 dark:bg-green-950',
    iconColor: 'text-green-600 dark:text-green-400',
    buttonLabel: 'Xác nhận',
    buttonVariant: 'default',
    group: 'primary',
  },
  {
    key: 'confirm_completion',
    label: 'Xác nhận hoàn thành',
    description: 'Đánh dấu buổi khám đã hoàn thành',
    icon: <ClipboardCheck className="h-4 w-4" />,
    iconBg: 'bg-green-100 dark:bg-green-950',
    iconColor: 'text-green-600 dark:text-green-400',
    buttonLabel: 'Hoàn thành',
    buttonVariant: 'default',
    group: 'primary',
    inline: true,
  },
  {
    key: 'resolve_dispute',
    label: 'Giải quyết tranh chấp',
    description: 'Xem xét và đưa ra phán quyết cho khiếu nại',
    icon: <Scale className="h-4 w-4" />,
    iconBg: 'bg-amber-100 dark:bg-amber-950',
    iconColor: 'text-amber-600 dark:text-amber-400',
    buttonLabel: 'Giải quyết',
    buttonVariant: 'outline',
    group: 'primary',
  },
  {
    key: 'reject',
    label: 'Từ chối lịch hẹn',
    description: 'Bệnh nhân sẽ được hoàn tiền tự động',
    icon: <XCircle className="h-4 w-4" />,
    iconBg: 'bg-red-100 dark:bg-red-950',
    iconColor: 'text-red-600 dark:text-red-400',
    buttonLabel: 'Từ chối',
    buttonVariant: 'destructive',
    group: 'danger',
  },
]

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const actions = getAvailableActions(appointment.status)
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  const confirmCompletion = useConfirmCompletion({
    mutation: {
      onSuccess: () => {
        toast.success('Đã xác nhận hoàn thành')
        queryClient.invalidateQueries({
          queryKey: [
            { url: '/api/appointments/:id', params: { id: appointment.id } },
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/appointments/admin/all' }],
        })
      },
      onError: () => {
        toast.error('Có lỗi xảy ra')
      },
    },
  })

  // Reschedule: only shown when PENDING_CONFIRMATION + appointments:edit permission
  const canReschedule =
    appointment.status === 'PENDING_CONFIRMATION' &&
    hasPermission(ALL_PERMISSIONS.APPOINTMENTS_EDIT)

  if (actions.length === 0 && !canReschedule) return null

  const allActions = canReschedule ? [...actions, 'reschedule'] : actions

  const primaryActions = actionConfigs.filter(
    (cfg) => allActions.includes(cfg.key as never) && cfg.group === 'primary'
  )
  const dangerActions = actionConfigs.filter(
    (cfg) => allActions.includes(cfg.key as never) && cfg.group === 'danger'
  )

  function handleAction(cfg: ActionConfig) {
    if (cfg.inline) {
      confirmCompletion.mutate({ id: appointment.id! })
    } else {
      setOpenDialog(cfg.key)
    }
  }

  function isDisabled(key: string) {
    if (confirmCompletion.isPending) return true
    if (key === 'confirm' && !appointment.doctorId) return true
    return false
  }

  function getDisabledReason(key: string) {
    if (key === 'confirm' && !appointment.doctorId) {
      return 'Cần phân công bác sĩ trước khi xác nhận'
    }
    return undefined
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Hành động quản trị
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Primary actions */}
          {primaryActions.length > 0 && (
            <div className="px-2 pb-2">
              {primaryActions.map((cfg, i) => {
                const disabled = isDisabled(cfg.key)
                const reason = getDisabledReason(cfg.key)
                const isPendingThis = cfg.inline && confirmCompletion.isPending

                return (
                  <TooltipProvider key={cfg.key}>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors',
                            !disabled
                              ? 'hover:bg-muted/50 cursor-pointer'
                              : 'opacity-50 cursor-not-allowed',
                            i < primaryActions.length - 1 &&
                              'border-b border-border/50'
                          )}
                          onClick={() => !disabled && handleAction(cfg)}
                        >
                          {/* Icon badge */}
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                              cfg.iconBg,
                              cfg.iconColor
                            )}
                          >
                            {cfg.icon}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none mb-0.5">
                              {cfg.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {cfg.description}
                            </p>
                          </div>

                          {/* Action trigger */}
                          <Button
                            size="sm"
                            variant={cfg.buttonVariant}
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAction(cfg)
                            }}
                            className="shrink-0 h-7 px-2.5 text-xs"
                          >
                            {isPendingThis ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                {cfg.buttonLabel}
                                <ChevronRight className="ms-1 h-3 w-3" />
                              </>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {reason && (
                        <TooltipContent side="top">
                          <p>{reason}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          )}

          {/* Danger zone */}
          {dangerActions.length > 0 && (
            <div className="mx-4 mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-1 py-1">
              {dangerActions.map((cfg) => {
                const disabled = isDisabled(cfg.key)
                const reason = getDisabledReason(cfg.key)

                return (
                  <TooltipProvider key={cfg.key}>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'group flex items-center gap-3 rounded-md px-2 py-2 transition-colors',
                            !disabled
                              ? 'hover:bg-destructive/10 cursor-pointer'
                              : 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => !disabled && handleAction(cfg)}
                        >
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                              cfg.iconBg,
                              cfg.iconColor
                            )}
                          >
                            {cfg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none mb-0.5">
                              {cfg.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {cfg.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAction(cfg)
                            }}
                            className="shrink-0 h-7 px-2.5 text-xs"
                          >
                            {cfg.buttonLabel}
                            <ChevronRight className="ms-1 h-3 w-3" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {reason && (
                        <TooltipContent side="top">
                          <p>{reason}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <RescheduleDialog
        appointmentId={appointment.id!}
        currentDoctorId={appointment.doctorId}
        open={openDialog === 'reschedule'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
      />
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
