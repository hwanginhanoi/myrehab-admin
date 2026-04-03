import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title="Giao diện"
      desc="Tuỳ chỉnh giao diện ứng dụng. Tự động chuyển đổi giữa chủ đề sáng và tối."
    >
      <AppearanceForm />
    </ContentSection>
  )
}
