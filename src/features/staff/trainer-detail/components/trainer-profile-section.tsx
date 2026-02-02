import { TrainerContentSection } from './trainer-content-section'
import { TrainerProfileForm } from './trainer-profile-form'
import type { StaffResponse } from '@/api'

type TrainerProfileSectionProps = {
  trainer: StaffResponse
  isLoading: boolean
  readOnly?: boolean
}

export function TrainerProfileSection({ trainer, isLoading, readOnly }: TrainerProfileSectionProps) {
  return (
    <TrainerContentSection
      title='Thông tin cá nhân'
      desc={readOnly ? 'Xem thông tin cá nhân của huấn luyện viên.' : 'Quản lý thông tin cá nhân của huấn luyện viên.'}
    >
      <TrainerProfileForm trainer={trainer} isLoading={isLoading} readOnly={readOnly} />
    </TrainerContentSection>
  )
}
