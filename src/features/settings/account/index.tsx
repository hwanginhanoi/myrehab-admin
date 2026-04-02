import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title="Tài khoản"
      desc="Cập nhật cài đặt tài khoản. Chọn ngôn ngữ và múi giờ ưa thích."
    >
      <AccountForm />
    </ContentSection>
  )
}
