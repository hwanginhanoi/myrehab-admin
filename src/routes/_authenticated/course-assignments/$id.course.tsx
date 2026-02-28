import { createFileRoute } from '@tanstack/react-router'
import { CourseStructureSection } from '@/features/course-assignment-detail/components/course-structure-section'

export const Route = createFileRoute(
  '/_authenticated/course-assignments/$id/course'
)({
  component: CourseStructureSection,
})
