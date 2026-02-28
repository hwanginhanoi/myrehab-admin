import { createFileRoute } from '@tanstack/react-router'
import { AssignmentInfoSection } from '@/features/course-assignment-detail/components/assignment-info-section'

export const Route = createFileRoute('/_authenticated/course-assignments/$id/')(
  {
    component: AssignmentInfoSection,
  }
)
