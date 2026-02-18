import { DoctorContentSection } from './doctor-content-section'
import { ExerciseGroupListCard } from './exercise-group-list-card'

type DoctorExerciseGroupSectionProps = {
  doctorId: number
  readOnly?: boolean
}

export function DoctorExerciseGroupSection({ doctorId, readOnly }: DoctorExerciseGroupSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Nhóm bài tập'
      desc={
        readOnly
          ? 'Xem các nhóm bài tập được gán cho bác sĩ này.'
          : 'Xem và quản lý các nhóm bài tập được gán cho bác sĩ này.'
      }
      fullWidth
    >
      <ExerciseGroupListCard doctorId={doctorId} readOnly={readOnly} />
    </DoctorContentSection>
  )
}
