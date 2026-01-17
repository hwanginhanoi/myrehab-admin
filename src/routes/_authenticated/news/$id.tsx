import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetNewsById } from '@/api'
import { NewsFormComponent } from '@/features/news/components/news-form'

const newsSearchSchema = z.object({
  mode: z.enum(['view', 'edit']).optional().catch('view'),
})

function NewsDetail() {
  const { id } = Route.useParams()
  const { mode } = Route.useSearch()

  const { data: news, isLoading } = useGetNewsById(Number(id))

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
        ) : news ? (
          <NewsFormComponent news={news} mode={mode || 'view'} />
        ) : (
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>Không tìm thấy tin tức</p>
          </div>
        )}
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/news/$id')({
  validateSearch: newsSearchSchema,
  component: NewsDetail,
})
