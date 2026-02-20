import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { CourseAssignmentScreen } from '@/features/courses'

type AssignSearch = {
  patientId?: number
  doctorId?: number
}

export const Route = createFileRoute('/_authenticated/courses/assign')({
  component: AssignCourseRoute,
  validateSearch: (search: Record<string, unknown>): AssignSearch => {
    return {
      patientId: search.patientId as number | undefined,
      doctorId: search.doctorId as number | undefined,
    }
  },
})

function AssignCourseRoute() {
  const { patientId, doctorId } = Route.useSearch()

  return (
    <>
      <Header>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold md:text-2xl'>Gán khóa học</h1>
        </div>
      </Header>

      <Main className='flex flex-col p-6'>
        <CourseAssignmentScreen preSelectedPatientId={patientId} preSelectedDoctorId={doctorId} />
      </Main>
    </>
  )
}
