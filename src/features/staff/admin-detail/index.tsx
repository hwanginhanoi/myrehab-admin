import { getRouteApi, Outlet } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, Shield, UserCog } from 'lucide-react'
import { useGetStaffById } from '@/api'
import { AdminSidebarNav } from './components/admin-sidebar-nav'

const route = getRouteApi('/_authenticated/staff/admins/$adminId')

export function AdminDetail() {
  const { adminId } = route.useParams()
  const navigate = route.useNavigate()

  // Fetch admin data
  const { data: admin, isLoading, error } = useGetStaffById(Number(adminId))

  // Handle error states
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>Không tìm thấy quản trị viên</p>
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

  // Check if the staff member is actually an admin
  if (admin && admin.staffType !== 'ADMIN' && admin.staffType !== 'SUPER_ADMIN') {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <p className='text-lg font-semibold text-destructive'>
          Nhân viên này không phải là quản trị viên
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
      href: `/staff/admins/${adminId}`,
      icon: <UserCog size={18} />,
    },
    {
      title: 'Quản lý quyền',
      href: `/staff/admins/${adminId}/permissions`,
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
        <span className='text-foreground font-medium'>Chi tiết quản trị viên</span>
      </div>

      {/* Page Header */}
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          {isLoading ? 'Đang tải...' : admin?.fullName || 'Chi tiết Quản trị viên'}
        </h1>
        <p className='text-muted-foreground'>
          Xem và quản lý thông tin quản trị viên.
        </p>
      </div>

      <Separator className='my-4 lg:my-6' />

      {/* Content with Sidebar */}
      <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <aside className='top-0 lg:sticky lg:w-1/5'>
          <AdminSidebarNav items={sidebarNavItems} adminId={adminId} />
        </aside>
        <div className='flex w-full overflow-y-hidden p-1'>
          <Outlet />
        </div>
      </div>
    </>
  )
}
