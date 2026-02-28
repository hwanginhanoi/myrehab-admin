import { getRouteApi } from '@tanstack/react-router'
import { MessageSquare, AlertTriangle, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetPainReports } from '@/api'
import { formatDateTime } from '@/lib/course-assignment-utils'
import { AssignmentContentSection } from './assignment-content-section'

const route = getRouteApi('/_authenticated/course-assignments/$id')

export function DailyFeedbackSection() {
  const search = route.useSearch()
  const { courseId, patientFullName } = search

  const { data: painReports, isLoading } = useGetPainReports(
    { courseId },
    { query: { enabled: !!courseId } }
  )

  // Filter pain reports to only show reports for this specific patient
  const patientReports = (painReports ?? []).filter(
    (report) => !patientFullName || report.patientName === patientFullName
  )

  return (
    <AssignmentContentSection
      title="Đánh giá hằng ngày"
      desc="Phản hồi và báo cáo đau của bệnh nhân theo từng ngày tập."
      fullWidth
    >
      <>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : patientReports.length > 0 ? (
          <div className="space-y-3">
            {patientReports.map((report) => (
              <Card key={report.feedbackId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Ngày {report.dayNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {report.date && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDateTime(report.date)}
                        </span>
                      )}
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Có đau
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {report.painDetails && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Chi tiết đau
                        </p>
                        <p className="text-sm">{report.painDetails}</p>
                      </div>
                    )}
                    {report.patientName && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Bệnh nhân
                        </p>
                        <p className="text-sm font-medium">
                          {report.patientName}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                Chưa có báo cáo đau nào từ bệnh nhân.
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Báo cáo sẽ xuất hiện khi bệnh nhân phản hồi có đau trong quá
                trình tập.
              </p>
            </CardContent>
          </Card>
        )}
      </>
    </AssignmentContentSection>
  )
}
