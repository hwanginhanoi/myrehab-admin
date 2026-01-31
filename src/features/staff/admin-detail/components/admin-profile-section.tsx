import { AdminContentSection } from './admin-content-section'
import { AdminProfileForm } from './admin-profile-form'
import type { StaffResponse } from '@/api'

type AdminProfileSectionProps = {
  admin: StaffResponse
  isLoading: boolean
}

export function AdminProfileSection({ admin, isLoading }: AdminProfileSectionProps) {
  return (
    <AdminContentSection
      title='Thông tin cá nhân'
      desc='Quản lý thông tin cá nhân của quản trị viên.'
    >
      <AdminProfileForm admin={admin} isLoading={isLoading} />
    </AdminContentSection>
  )
}
