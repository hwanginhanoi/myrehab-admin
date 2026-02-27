import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { CourseRequestForm } from '@/features/course-request-form'

function CourseRequestNew() {
  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Tạo yêu cầu khóa tập mới</h2>
          <p className='text-muted-foreground'>
            Điền thông tin và thiết kế lịch tập cho bệnh nhân. Yêu cầu sẽ được gửi cho bác sĩ phê duyệt.
          </p>
        </div>
        <CourseRequestForm />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/course-requests/new')({
  component: CourseRequestNew,
})
