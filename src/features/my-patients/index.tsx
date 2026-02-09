import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetMyPatients, type DoctorPatientResponse, type GetMyPatientsQueryParams } from '@/api'
import { MyPatientsProvider, useMyPatients } from './components/my-patients-provider'
import { MyPatientsTable } from './components/my-patients-table'
import { PatientPreviewDialog } from './components/patient-preview-dialog'

const route = getRouteApi('/_authenticated/my-patients/')

function MyPatientsContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { open, setOpen, currentPatient } = useMyPatients()

  const page = (search.page ?? 1) - 1
  const pageSize = search.pageSize ?? 10
  const query = search.query?.trim()

  const queryParams = useMemo<GetMyPatientsQueryParams>(
    () => ({
      pageable: {
        page,
        size: pageSize,
      },
      ...(query && { query }),
    }),
    [page, pageSize, query]
  )

  const { data, isLoading } = useGetMyPatients(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const patients = (data?.content ?? []) as DoctorPatientResponse[]
  const totalPages = data?.page?.totalPages ?? 0

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Bệnh nhân của tôi</h2>
            <p className='text-muted-foreground'>
              Quản lý danh sách bệnh nhân được phân công.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <span className='text-muted-foreground'>Đang tải...</span>
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

      {/* Patient Preview Dialog */}
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
