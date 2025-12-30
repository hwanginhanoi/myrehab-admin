import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetFormById } from '@/api'
import { RehabilitationFormComponent } from '@/features/rehabilitation-forms/components/rehabilitation-form'

const rehabilitationFormSearchSchema = z.object({
  mode: z.enum(['view', 'edit']).optional().catch('view'),
})

function RehabilitationFormDetail() {
  const { id } = Route.useParams()
  const { mode } = Route.useSearch()

  const { data: form, isLoading, error } = useGetFormById(Number(id))

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
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Đang tải...</p>
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center h-64 gap-2'>
            <p className='text-destructive font-semibold'>Lỗi khi tải phiếu khám</p>
            <p className='text-muted-foreground text-sm'>
              {error?.message || 'Không tìm thấy phiếu khám với ID: ' + id}
            </p>
          </div>
        ) : form ? (
          <RehabilitationFormComponent form={form} mode={mode || 'view'} />
        ) : (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Không tìm thấy phiếu khám</p>
          </div>
        )}
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/rehabilitation-forms/$id')({
  validateSearch: rehabilitationFormSearchSchema,
  component: RehabilitationFormDetail,
})
