import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title="Hồ sơ"
      desc="Đây là cách người khác nhìn thấy bạn trên trang web."
    >
      <ProfileForm />
    </ContentSection>
  )
}
