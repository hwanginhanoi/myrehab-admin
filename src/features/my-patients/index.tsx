import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { useGetMyAssignedPatients, type DoctorPatientResponse, type GetMyAssignedPatientsQueryParams } from '@/api'
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

  const queryParams = useMemo<GetMyAssignedPatientsQueryParams>(
    () => ({
      pageable: {
        page,
        size: pageSize,
      },
      ...(query && { query }),
    }),
    [page, pageSize, query]
  )

  const { data, isLoading } = useGetMyAssignedPatients(queryParams, {
    query: {
      placeholderData: (previousData) => previousData,
    },
  })

  const patients = (data?.content ?? []) as DoctorPatientResponse[]
  const totalPages = data?.page?.totalPages ?? 0

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold'>Bệnh nhân của tôi</h1>
        </div>
      </Header>
      <Main fixed>
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
