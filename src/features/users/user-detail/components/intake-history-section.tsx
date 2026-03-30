import type { AppointmentResponse } from '@/api'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatientIntakeAppointments } from '@/hooks/usePatientIntakeAppointments'

type IntakeHistorySectionProps = {
  userId: number
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  )
}

function IntakeCard({ appt }: { appt: AppointmentResponse }) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <p className="text-xs text-muted-foreground font-medium">
        {appt.appointmentDate} · Lịch hẹn #{appt.id}
      </p>

      {appt.pastResultImageKeys && appt.pastResultImageKeys.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Hình ảnh kết quả</p>
          <div className="flex flex-wrap gap-2">
            {appt.pastResultImageKeys.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`Kết quả ${idx + 1}`}
                  className="h-16 w-16 rounded-md object-cover border hover:opacity-80 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {appt.existingProblems && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Vấn đề hiện tại</p>
          <p className="text-sm">{appt.existingProblems}</p>
        </div>
      )}

      {appt.patientTarget && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Mục tiêu điều trị</p>
          <p className="text-sm">{appt.patientTarget}</p>
        </div>
      )}
    </div>
  )
}

export function IntakeHistorySection({ userId }: IntakeHistorySectionProps) {
  const { intakeAppointments, isLoading } = usePatientIntakeAppointments(userId, !!userId)

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto pb-12">
        <LoadingSkeleton />
      </div>
    )
  }

  if (intakeAppointments.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto pb-12">
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-muted-foreground text-sm pt-6">
            Bệnh nhân chưa có lịch sử khám ban đầu
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto pb-12">
      <Tabs defaultValue={String(intakeAppointments[0].id)}>
        <TabsList className="flex flex-col h-auto items-stretch gap-1 bg-transparent p-0 w-full">
          {intakeAppointments.map((appt) => (
            <TabsTrigger
              key={appt.id}
              value={String(appt.id)}
              className="justify-start px-3 py-2 text-left data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md"
            >
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-xs font-medium">{appt.appointmentDate}</span>
                <span className="text-xs text-muted-foreground">#{appt.id}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {intakeAppointments.map((appt) => (
          <TabsContent key={appt.id} value={String(appt.id)} className="mt-0 ml-4">
            <IntakeCard appt={appt} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
