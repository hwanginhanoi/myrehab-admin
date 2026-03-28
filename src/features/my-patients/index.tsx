import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useGetMyPatients,
  type DoctorPatientResponse,
  type GetMyPatientsQueryParams,
} from '@/api'
import { useGetDoctorPatients1 } from '@/api/hooks/TrainerHooks/useGetDoctorPatients1'
import { useAuthStore } from '@/stores/auth-store'
import {
  MyPatientsProvider,
  useMyPatients,
} from './components/my-patients-provider'
import { MyPatientsTable } from './components/my-patients-table'
import { PatientPreviewDialog } from './components/patient-preview-dialog'

const route = getRouteApi('/_authenticated/my-patients/')

function MyPatientsContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { open, setOpen, currentPatient } = useMyPatients()
  const userType = useAuthStore((s) => s.userType)
  const isTrainer = userType === 'TRAINER'

  const page = (search.page ?? 1) - 1
  const pageSize = search.pageSize ?? 10
  const query = search.query?.trim()

  const queryParams = useMemo<GetMyPatientsQueryParams>(
    () => ({
      pageable: { page, size: pageSize },
      ...(query && { query }),
    }),
    [page, pageSize, query]
  )

  const { data: doctorData, isLoading: isDoctorLoading } = useGetMyPatients(queryParams, {
    query: {
      enabled: !isTrainer,
      placeholderData: (previousData) => previousData,
    },
  })

  const { data: trainerData, isLoading: isTrainerLoading } = useGetDoctorPatients1(queryParams, {
    query: {
      enabled: isTrainer,
      placeholderData: (previousData) => previousData,
    },
  })

  const data = isTrainer ? trainerData : doctorData
  const isLoading = isTrainer ? isTrainerLoading : isDoctorLoading
  const patients = (data?.content ?? []) as DoctorPatientResponse[]
  const totalPages = data?.page?.totalPages ?? 0

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Bệnh nhân của tôi
            </h2>
            <p className="text-muted-foreground">
              Quản lý danh sách bệnh nhân được phân công.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="text-muted-foreground">Đang tải...</span>
          </div>
        ) : (
          <MyPatientsTable
            data={patients}
            search={search}
            navigate={navigate}
            pageCount={totalPages}
          />
        )}
      </Main>

      <PatientPreviewDialog
        patient={currentPatient}
        open={open === 'preview'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'preview' : null)}
      />
    </>
  )
}

export function MyPatients() {
  return (
    <MyPatientsProvider>
      <MyPatientsContent />
    </MyPatientsProvider>
  )
}
