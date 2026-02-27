import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { CourseAssignmentDetail } from '@/features/course-assignment-detail'

const courseAssignmentDetailSearchSchema = z.object({
  courseId: z.coerce.number(),
  courseTitle: z.string().optional().catch(undefined),
  patientFullName: z.string().optional().catch(undefined),
  assignedByDoctorName: z.string().optional().catch(undefined),
  assignedAt: z.string().optional().catch(undefined),
  purchaseStatus: z
    .enum(['PENDING_PURCHASE', 'PURCHASED', 'EXPIRED'])
    .optional()
    .catch(undefined),
  hasStarted: z.coerce.boolean().optional().catch(undefined),
  isCompleted: z.coerce.boolean().optional().catch(undefined),
  patientId: z.coerce.number().optional().catch(undefined),
})

function CourseAssignmentDetailRoute() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <CourseAssignmentDetail />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/course-assignments/$id')({
  validateSearch: courseAssignmentDetailSearchSchema,
  component: CourseAssignmentDetailRoute,
})
