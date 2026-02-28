import { getRouteApi, Outlet, useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  ClipboardList,
  BookOpen,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AssignmentSidebarNav } from './components/assignment-sidebar-nav'

const route = getRouteApi('/_authenticated/course-assignments/$id')

export function CourseAssignmentDetail() {
  const { id } = route.useParams()
  const search = route.useSearch()
  const navigate = useNavigate()

  const { courseTitle, patientFullName } = search

  const sidebarNavItems = [
    {
      title: 'Thông tin phân công',
      href: `/course-assignments/${id}`,
      icon: <ClipboardList size={18} />,
    },
    {
      title: 'Chi tiết khóa tập',
      href: `/course-assignments/${id}/course`,
      icon: <BookOpen size={18} />,
    },
    {
      title: 'Đánh giá hằng ngày',
      href: `/course-assignments/${id}/feedback`,
      icon: <MessageSquare size={18} />,
    },
  ]

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/course-assignments' })}
          className="h-8 gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Phân công khóa tập
        </Button>
        <span>/</span>
        <span className="text-foreground font-medium">Chi tiết phân công</span>
      </div>

      {/* Page Header */}
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {courseTitle || 'Chi tiết phân công'}
        </h1>
        <p className="text-muted-foreground">
          {patientFullName
            ? `Phân công cho bệnh nhân ${patientFullName}`
            : 'Xem thông tin chi tiết về phân công khóa tập.'}
        </p>
      </div>

      <Separator className="my-4 lg:my-6" />

      {/* Content with Sidebar */}
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <AssignmentSidebarNav items={sidebarNavItems} search={search} />
        </aside>
        <div className="flex w-full overflow-y-hidden p-1">
          <Outlet />
        </div>
      </div>
    </>
  )
}
