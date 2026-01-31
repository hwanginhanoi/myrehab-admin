import { useMemo } from 'react'
import { getRouteApi, Outlet } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, Shield, UserCog, Users, UserRound } from 'lucide-react'
import { useGetStaffById, useGetTrainersByDoctor } from '@/api'
import { DoctorDetailProvider, useDoctorDetail } from './components/doctor-detail-provider'
import { DoctorSidebarNav } from './components/doctor-sidebar-nav'
import { TrainerAssignmentDialog } from './components/trainer-assignment-dialog'
import { TrainerRemovalDialog } from './components/trainer-removal-dialog'
import { PatientAssignmentDialog } from './components/patient-assignment-dialog'
import { PatientRemovalDialog } from './components/patient-removal-dialog'

const route = getRouteApi('/_authenticated/staff/doctors/$doctorId')

function DoctorDetailContent() {
  const { doctorId } = route.useParams()
  const navigate = route.useNavigate()
  const { open, setOpen, currentTrainer, currentPatient } = useDoctorDetail()

  // Fetch doctor data
  const { data: doctor, isLoading, error } = useGetStaffById(Number(doctorId))

  // Fetch trainers to get assigned IDs
  const { data: trainers } = useGetTrainersByDoctor(Number(doctorId))

  const assignedTrainerIds = useMemo(() => {
    return trainers?.map((t) => t.id).filter((id): id is number => id !== undefined) || []
  }, [trainers])

  // Handle error states
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>Không tìm thấy bác sĩ</p>
        <Button
          onClick={() =>
            navigate({
              to: '/staff',
            })
          }
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách nhân viên
        </Button>
      </div>
    )
  }

  // Check if the staff member is actually a doctor
  if (doctor && doctor.staffType !== 'DOCTOR') {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>
          Nhân viên này không phải là bác sĩ
        </p>
        <Button
          onClick={() =>
            navigate({
              to: '/staff',
            })
          }
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách nhân viên
        </Button>
      </div>
    )
  }

  const sidebarNavItems = [
    {
      title: 'Thông tin',
      href: `/staff/doctors/${doctorId}`,
      icon: <UserCog size={18} />,
    },
    {
      title: 'Huấn luyện viên',
      href: `/staff/doctors/${doctorId}/trainers`,
      icon: <Users size={18} />,
    },
    {
      title: 'Bệnh nhân',
      href: `/staff/doctors/${doctorId}/patients`,
      icon: <UserRound size={18} />,
    },
    {
      title: 'Quản lý quyền',
      href: `/staff/doctors/${doctorId}/permissions`,
      icon: <Shield size={18} />,
    },
  ]

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() =>
            navigate({
              to: '/staff',
            })
          }
          className='h-8 gap-1'
        >
          <ChevronLeft className='h-4 w-4' />
          Nhân viên
        </Button>
        <span>/</span>
        <span className='text-foreground font-medium'>Chi tiết bác sĩ</span>
      </div>

      {/* Page Header */}
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {isLoading ? 'Đang tải...' : doctor?.fullName || 'Chi tiết Bác sĩ'}
        </h1>
        <p className='text-muted-foreground'>
          Xem và quản lý thông tin bác sĩ, huấn luyện viên và bệnh nhân được gán.
        </p>
      </div>

      <Separator className='my-4 lg:my-6' />

      {/* Content with Sidebar */}
      <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <aside className='top-0 lg:sticky lg:w-1/5'>
          <DoctorSidebarNav items={sidebarNavItems} doctorId={doctorId} />
        </aside>
        <div className='flex w-full overflow-y-hidden p-1'>
          <Outlet />
        </div>
      </div>

      {/* Dialogs */}
      <TrainerAssignmentDialog
        doctorId={Number(doctorId)}
        open={open === 'assign'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'assign' : null)}
        assignedTrainerIds={assignedTrainerIds}
      />

      <TrainerRemovalDialog
        doctorId={Number(doctorId)}
        trainer={currentTrainer}
        open={open === 'remove'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'remove' : null)}
      />

      <PatientAssignmentDialog
        doctorId={Number(doctorId)}
        open={open === 'assignPatient'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'assignPatient' : null)}
        assignedPatientIds={[]}
      />

      <PatientRemovalDialog
        doctorId={Number(doctorId)}
        patient={currentPatient}
        open={open === 'removePatient'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'removePatient' : null)}
      />
    </>
  )
}

export function DoctorDetail() {
  return (
    <DoctorDetailProvider>
      <DoctorDetailContent />
    </DoctorDetailProvider>
  )
}
