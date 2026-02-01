import { DoctorContentSection } from './doctor-content-section'
import { PatientListCard } from './patient-list-card'
import { type NavigateFn } from '@/hooks/use-table-url-state'

type DoctorPatientSectionProps = {
  doctorId: number
  search: Record<string, unknown>
  navigate: NavigateFn
  readOnly?: boolean
}

export function DoctorPatientSection({
  doctorId,
  search,
  navigate,
  readOnly,
}: DoctorPatientSectionProps) {
  return (
    <DoctorContentSection
      title='Quản lý Bệnh nhân'
      desc={readOnly ? 'Xem các bệnh nhân được gán cho bác sĩ này.' : 'Xem và quản lý các bệnh nhân được gán cho bác sĩ này.'}
      fullWidth
    >
      <PatientListCard doctorId={doctorId} search={search} navigate={navigate} readOnly={readOnly} />
    </DoctorContentSection>
  )
}
