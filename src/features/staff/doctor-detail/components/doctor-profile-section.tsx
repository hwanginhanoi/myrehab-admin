import { DoctorContentSection } from './doctor-content-section'
import { DoctorProfileForm } from './doctor-profile-form'
import type { StaffResponse } from '@/api'

type DoctorProfileSectionProps = {
  doctor: StaffResponse
  isLoading: boolean
}

export function DoctorProfileSection({ doctor, isLoading }: DoctorProfileSectionProps) {
  return (
    <DoctorContentSection
      title='Thông tin cá nhân'
      desc='Quản lý thông tin cá nhân và chuyên môn của bác sĩ.'
    >
      <DoctorProfileForm doctor={doctor} isLoading={isLoading} />
    </DoctorContentSection>
  )
}
