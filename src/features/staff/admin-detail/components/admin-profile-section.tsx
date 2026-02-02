import { AdminContentSection } from './admin-content-section'
import { AdminProfileForm } from './admin-profile-form'
import type { StaffResponse } from '@/api'

type AdminProfileSectionProps = {
  admin: StaffResponse
  isLoading: boolean
  readOnly?: boolean
}

export function AdminProfileSection({ admin, isLoading, readOnly }: AdminProfileSectionProps) {
  return (
    <AdminContentSection
      title='Thông tin cá nhân'
      desc={readOnly ? 'Xem thông tin cá nhân của quản trị viên.' : 'Quản lý thông tin cá nhân của quản trị viên.'}
    >
      <AdminProfileForm admin={admin} isLoading={isLoading} readOnly={readOnly} />
    </AdminContentSection>
  )
}
