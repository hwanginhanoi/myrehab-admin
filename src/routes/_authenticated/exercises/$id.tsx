import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetExerciseById } from '@/api'
import { ExerciseFormComponent } from '@/features/exercises/components/exercise-form'

const exerciseSearchSchema = z.object({
  mode: z.enum(['view', 'edit']).optional().catch('view'),
})

function ExerciseDetail() {
  const { id } = Route.useParams()
  const { mode } = Route.useSearch()

  const { data: exercise, isLoading } = useGetExerciseById(Number(id))

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
        ) : exercise ? (
          <ExerciseFormComponent exercise={exercise} mode={mode || 'view'} />
        ) : (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Không tìm thấy bài tập</p>
          </div>
        )}
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/exercises/$id')({
  validateSearch: exerciseSearchSchema,
  component: ExerciseDetail,
})
