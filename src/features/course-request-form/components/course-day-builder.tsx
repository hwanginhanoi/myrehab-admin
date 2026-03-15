import type { DayWithExercises } from '@/features/courses/components/course-assignment-screen'
import type { AssignmentAction } from '../index'
import { CourseCustomizationSection } from '@/features/courses/components/course-customization-section'

type CourseDayBuilderProps = {
  customizedDays: Map<number, DayWithExercises>
  dispatch: React.Dispatch<AssignmentAction>
  courseName: string
}

export function CourseDayBuilder({
  customizedDays,
  dispatch,
  courseName,
}: CourseDayBuilderProps) {
  return (
    <CourseCustomizationSection
      courseName={{ vi: courseName, en: '' }}
      customizedDays={customizedDays}
      dispatch={dispatch}
    />
  )
}
