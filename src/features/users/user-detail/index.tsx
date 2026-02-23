import { getRouteApi, Outlet } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Building2, ChevronLeft, Shield, ShieldCheck, UserCog } from 'lucide-react'
import { useGetUserById } from '@/api'
import { UserSidebarNav } from './components/user-sidebar-nav'

const route = getRouteApi('/_authenticated/users/$id')

export function UserDetail() {
  const { id } = route.useParams()
  const navigate = route.useNavigate()

  const { data: user, isLoading, error } = useGetUserById(Number(id))

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>Không tìm thấy người dùng</p>
        <Button
          onClick={() =>
            navigate({
              to: '/users',
            })
          }
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Quay lại danh sách người dùng
        </Button>
      </div>
    )
  }

  const sidebarNavItems = [
    {
      title: 'Thông tin người dùng',
      href: `/users/${id}`,
      icon: <UserCog size={18} />,
    },
    {
      title: 'Bảo hiểm y tế',
      href: `/users/${id}/national-insurance`,
      icon: <Shield size={18} />,
    },
    {
      title: 'Bảo hiểm tư nhân',
      href: `/users/${id}/private-insurance`,
      icon: <ShieldCheck size={18} />,
    },
    {
      title: 'Thông tin công ty',
      href: `/users/${id}/company-info`,
      icon: <Building2 size={18} />,
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
              to: '/users',
            })
          }
          className='h-8 gap-1'
        >
          <ChevronLeft className='h-4 w-4' />
          Người dùng
        </Button>
        <span>/</span>
        <span className='text-foreground font-medium'>Chi tiết người dùng</span>
      </div>

      {/* Page Header */}
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {isLoading ? 'Đang tải...' : user?.fullName || 'Chi tiết Người dùng'}
        </h1>
        <p className='text-muted-foreground'>
          Xem thông tin chi tiết của người dùng.
        </p>
      </div>

      <Separator className='my-4 lg:my-6' />

      {/* Content with Sidebar */}
      <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <aside className='top-0 lg:sticky lg:w-1/5'>
          <UserSidebarNav items={sidebarNavItems} />
        </aside>
        <div className='flex w-full overflow-y-hidden p-1'>
          <Outlet />
        </div>
      </div>
    </>
  )
}
