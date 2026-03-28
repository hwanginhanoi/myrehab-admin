import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetUserById, type DoctorPatientResponse } from '@/api'
import { usePatientIntakeAppointments } from '@/hooks/usePatientIntakeAppointments'

type PatientPreviewDialogProps = {
  patient: DoctorPatientResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientPreviewDialog({
  patient,
  open,
  onOpenChange,
}: PatientPreviewDialogProps) {
  const { data: userDetails, isLoading } = useGetUserById(
    patient?.userId ?? 0,
    { query: { enabled: !!patient?.userId && open } }
  )

  const { intakeAppointments, isLoading: isLoadingAppointments } = usePatientIntakeAppointments(
    patient?.userId,
    !!patient?.userId && open
  )

  const formatGender = (gender: string | undefined) => {
    if (!gender) return '-'
    if (gender === 'MALE') return 'Nam'
    if (gender === 'FEMALE') return 'Nữ'
    return gender
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Thông tin bệnh nhân</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : userDetails ? (
          <Tabs defaultValue="info" className="flex flex-1 gap-4 overflow-hidden">
            <TabsList className="flex flex-col h-auto items-stretch gap-1 bg-transparent p-0 w-36 shrink-0">
              <TabsTrigger
                value="info"
                className="justify-start px-3 py-2 text-left data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md text-sm"
              >
                Thông tin
              </TabsTrigger>
              <TabsTrigger
                value="intake"
                className="justify-start px-3 py-2 text-left data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md text-sm"
              >
                Lịch sử khám
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="info" className="mt-0 space-y-3">
                {[
                  { label: 'Họ và tên', value: userDetails.fullName },
                  { label: 'Giới tính', value: formatGender(userDetails.gender) },
                  {
                    label: 'Ngày sinh',
                    value: userDetails.dateOfBirth
                      ? format(new Date(userDetails.dateOfBirth), 'dd/MM/yyyy')
                      : '-',
                  },
                  { label: 'Số điện thoại', value: userDetails.phoneNumber },
                  { label: 'Email', value: userDetails.email },
                ].map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-3 items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <span className="col-span-2 text-sm">{value || '-'}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="intake" className="mt-0">
                {isLoadingAppointments ? (
                  <div className="flex h-32 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : intakeAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    Bệnh nhân chưa có lịch sử khám ban đầu
                  </p>
                ) : (
                  <Tabs defaultValue={String(intakeAppointments[0].id)} className="flex gap-3">
                    <TabsList className="flex flex-col h-auto items-stretch gap-1 bg-transparent p-0 w-28 shrink-0">
                      {intakeAppointments.map((appt) => (
                        <TabsTrigger
                          key={appt.id}
                          value={String(appt.id)}
                          className="justify-start px-2 py-1.5 text-left data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md"
                        >
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-xs font-medium">{appt.appointmentDate}</span>
                            <span className="text-xs text-muted-foreground">#{appt.id}</span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="flex-1">
                      {intakeAppointments.map((appt) => (
                        <TabsContent key={appt.id} value={String(appt.id)} className="mt-0 space-y-3">
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
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                )}
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            Không tìm thấy thông tin bệnh nhân
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
