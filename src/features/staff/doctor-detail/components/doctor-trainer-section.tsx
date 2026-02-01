import { type NavigateFn } from '@/hooks/use-table-url-state'
import { DoctorContentSection } from './doctor-content-section'
import { TrainerListCard } from './trainer-list-card'

type DoctorTrainerSectionProps = {
  doctorId: number
  search: Record<string, unknown>
  navigate: NavigateFn
  readOnly?: boolean
}

export function DoctorTrainerSection({
  doctorId,
  search,
  navigate,
  readOnly,
}: DoctorTrainerSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Huấn luyện viên'
      desc={readOnly ? 'Xem các huấn luyện viên được gán cho bác sĩ này.' : 'Xem và quản lý các huấn luyện viên được gán cho bác sĩ này.'}
      fullWidth
    >
      <TrainerListCard doctorId={doctorId} search={search} navigate={navigate} readOnly={readOnly} />
    </DoctorContentSection>
  )
}
