import { type NavigateFn } from '@/hooks/use-table-url-state'
import { DoctorContentSection } from './doctor-content-section'
import { TrainerListCard } from './trainer-list-card'

type DoctorTrainerSectionProps = {
  doctorId: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function DoctorTrainerSection({
  doctorId,
  search,
  navigate,
}: DoctorTrainerSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Huấn luyện viên'
      desc='Xem và quản lý các huấn luyện viên được gán cho bác sĩ này.'
      fullWidth
    >
      <TrainerListCard doctorId={doctorId} search={search} navigate={navigate} />
    </DoctorContentSection>
  )
}
