import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { format } from 'date-fns'

type DoctorFeedbackAlertProps = {
  doctorNotes: string
  reviewedAt?: string
  doctorName?: string
}

export function DoctorFeedbackAlert({
  doctorNotes,
  reviewedAt,
  doctorName,
}: DoctorFeedbackAlertProps) {
  return (
    <Alert variant="destructive" className="border-red-500">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Yêu cầu bị từ chối</AlertTitle>
      <AlertDescription className="mt-2 space-y-1">
        <p className="font-medium">
          Phản hồi từ bác sĩ{doctorName ? ` (${doctorName})` : ''}:
        </p>
        <p className="whitespace-pre-wrap">{doctorNotes}</p>
        {reviewedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Xét duyệt lúc: {format(new Date(reviewedAt), 'dd/MM/yyyy HH:mm')}
          </p>
        )}
      </AlertDescription>
    </Alert>
  )
}
