import { TrainerContentSection } from './trainer-content-section'
import { TrainerProfileForm } from './trainer-profile-form'
import type { StaffResponse } from '@/api'

type TrainerProfileSectionProps = {
  trainer: StaffResponse
  isLoading: boolean
}

export function TrainerProfileSection({ trainer, isLoading }: TrainerProfileSectionProps) {
  return (
    <TrainerContentSection
      title='Thông tin cá nhân'
      desc='Quản lý thông tin cá nhân của huấn luyện viên.'
    >
      <TrainerProfileForm trainer={trainer} isLoading={isLoading} />
    </TrainerContentSection>
  )
}
