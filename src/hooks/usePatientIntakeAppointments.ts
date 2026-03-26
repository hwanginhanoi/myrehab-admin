import { useGetPatientAppointmentsForStaff } from '@/api/hooks/AppointmentsHooks/useGetPatientAppointmentsForStaff'

const PAGEABLE = { page: 0, size: 50, sort: ['createdAt,desc'] }

export function usePatientIntakeAppointments(userId: number | undefined, enabled = true) {
  const { data, isLoading } = useGetPatientAppointmentsForStaff(
    userId ?? 0,
    { pageable: PAGEABLE },
    { query: { enabled: enabled && !!userId } }
  )

  const intakeAppointments = (data?.content ?? []).filter(
    (a) => a.pastResultImageKeys?.length || a.patientTarget || a.existingProblems
  )

  return { intakeAppointments, isLoading }
}
