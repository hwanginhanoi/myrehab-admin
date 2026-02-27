import { getRouteApi } from '@tanstack/react-router'
import { BookOpen, Dumbbell, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetCourseStructure } from '@/api'
import { AssignmentContentSection } from './assignment-content-section'

const route = getRouteApi('/_authenticated/course-assignments/$id')

export function CourseStructureSection() {
  const search = route.useSearch()
  const { courseId, courseTitle } = search

  const { data: course, isLoading } = useGetCourseStructure(courseId)

  return (
    <AssignmentContentSection
      title="Chi tiết khóa tập"
      desc="Cấu trúc khóa tập và danh sách bài tập theo ngày."
      fullWidth
    >
      <>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : course ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {course.title || courseTitle || 'Khóa tập'}
                  </CardTitle>
                  {course.description && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {course.description}
                    </p>
                  )}
                </div>
                {course.durationDays != null && (
                  <Badge variant="secondary" className="shrink-0">
                    {course.durationDays} ngày
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {course.days && course.days.length > 0 ? (
                <div className="space-y-3">
                  {course.days.map((day) => (
                    <div key={day.dayNumber} className="rounded-md border">
                      {/* Day header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 rounded-t-md">
                        <div>
                          <p className="text-sm font-medium">
                            Ngày {day.dayNumber}
                          </p>
                          {day.description && (
                            <p className="text-xs text-muted-foreground">
                              {day.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {day.exercises?.length ?? 0} bài tập
                        </Badge>
                      </div>

                      {/* Exercises */}
                      {day.exercises && day.exercises.length > 0 && (
                        <div className="divide-y">
                          {day.exercises.map((ex) => (
                            <div
                              key={ex.dayExerciseId}
                              className="flex items-start gap-3 px-4 py-3"
                            >
                              {ex.imageUrl ? (
                                <img
                                  src={ex.imageUrl}
                                  alt={ex.title}
                                  className="h-12 w-12 rounded object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                                  <Dumbbell className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {ex.title || 'Bài tập'}
                                </p>
                                {ex.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                    {ex.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-1.5">
                                  {ex.durationMinutes != null && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      {ex.durationMinutes} phút
                                    </span>
                                  )}
                                  {ex.customRepetitions != null && (
                                    <span className="text-xs text-muted-foreground">
                                      {ex.customRepetitions} lần
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Khóa tập chưa có ngày nào.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Không tìm thấy khóa tập.</p>
          </div>
        )}
      </>
    </AssignmentContentSection>
  )
}
