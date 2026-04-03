import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  MessageSquare,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Flame,
  Dumbbell,
  StickyNote,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/course-assignment-utils'
import { AssignmentContentSection } from './assignment-content-section'
import client from '@/lib/api-client'

type FeedbackResponse = {
  id?: number
  courseDayId?: number
  dayNumber?: number
  completionPercentage?: number
  effortPercentage?: number
  hasPain?: boolean
  painDetails?: string
  hardestExercise?: string
  hardestExerciseReason?: string
  generalNotes?: string
  patientName?: string
  createdAt?: string
}

const route = getRouteApi('/_authenticated/course-assignments/$id')

function useAdminCourseFeedback(courseId: number | undefined) {
  return useQuery({
    queryKey: ['admin-course-feedback', courseId],
    queryFn: async () => {
      const response = await client<FeedbackResponse[]>({
        method: 'GET',
        url: '/api/course-progress/admin/feedback',
        params: { courseId },
      })
      return response.data
    },
    enabled: !!courseId,
  })
}

export function DailyFeedbackSection() {
  const search = route.useSearch()
  const { courseId, patientFullName } = search

  const { data: feedbackList, isLoading } = useAdminCourseFeedback(courseId)

  const patientFeedback = (feedbackList ?? []).filter(
    (f) => !patientFullName || f.patientName === patientFullName
  )

  return (
    <AssignmentContentSection
      title="Đánh giá hằng ngày"
      desc="Phản hồi của bệnh nhân sau mỗi ngày tập luyện."
      fullWidth
    >
      <>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : patientFeedback.length > 0 ? (
          <div className="space-y-3">
            {patientFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Ngày {feedback.dayNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {feedback.createdAt && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDateTime(feedback.createdAt)}
                        </span>
                      )}
                      {feedback.hasPain && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Có đau
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Completion & Effort */}
                    <div className="flex gap-4">
                      {feedback.completionPercentage != null && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-muted-foreground">Hoàn thành:</span>
                          <span className="text-sm font-semibold">{feedback.completionPercentage}%</span>
                        </div>
                      )}
                      {feedback.effortPercentage != null && (
                        <div className="flex items-center gap-1.5">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-xs text-muted-foreground">Nỗ lực:</span>
                          <span className="text-sm font-semibold">{feedback.effortPercentage}%</span>
                        </div>
                      )}
                    </div>

                    {/* Pain details */}
                    {feedback.hasPain && feedback.painDetails && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Chi tiết đau</p>
                        <p className="text-sm">{feedback.painDetails}</p>
                      </div>
                    )}

                    {/* Hardest exercise */}
                    {feedback.hardestExercise && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Dumbbell className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Bài tập khó nhất</p>
                        </div>
                        <p className="text-sm font-medium">{feedback.hardestExercise}</p>
                        {feedback.hardestExerciseReason && (
                          <p className="text-xs text-muted-foreground mt-0.5">{feedback.hardestExerciseReason}</p>
                        )}
                      </div>
                    )}

                    {/* General notes */}
                    {feedback.generalNotes && (
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Ghi chú</p>
                        </div>
                        <p className="text-sm">{feedback.generalNotes}</p>
                      </div>
                    )}

                    {/* Patient name */}
                    {feedback.patientName && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bệnh nhân</p>
                        <p className="text-sm font-medium">{feedback.patientName}</p>
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
                Chưa có đánh giá nào từ bệnh nhân.
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Đánh giá sẽ xuất hiện sau khi bệnh nhân hoàn thành các ngày tập.
              </p>
            </CardContent>
          </Card>
        )}
      </>
    </AssignmentContentSection>
  )
}
