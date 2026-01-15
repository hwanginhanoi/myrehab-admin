import { DoctorContentSection } from './doctor-content-section'
import { TrainerListCard } from './trainer-list-card'

type DoctorTrainerSectionProps = {
  doctorId: number
}

export function DoctorTrainerSection({ doctorId }: DoctorTrainerSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Huấn luyện viên'
      desc='Xem và quản lý các huấn luyện viên được gán cho bác sĩ này.'
      fullWidth
    >
      <TrainerListCard doctorId={doctorId} />
    </DoctorContentSection>
  )
}
