import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CourseRequestStatus } from '@/features/course-requests/types'

type DoctorCourseRequestsTableToolbarProps = {
  currentStatus?: CourseRequestStatus
  onStatusChange: (status?: CourseRequestStatus) => void
  pendingCount?: number
}

export function DoctorCourseRequestsTableToolbar({
  currentStatus,
  onStatusChange,
  pendingCount,
}: DoctorCourseRequestsTableToolbarProps) {
  return (
    <div className='flex items-center justify-between'>
      <Tabs
        value={currentStatus ?? 'all'}
        onValueChange={(value) => {
          onStatusChange(value === 'all' ? undefined : (value as CourseRequestStatus))
        }}
      >
        <TabsList>
          <TabsTrigger value='all'>Tất cả</TabsTrigger>
          <TabsTrigger value='PENDING' className='gap-1'>
            Chờ duyệt
            {pendingCount != null && pendingCount > 0 && (
              <Badge variant='destructive' className='h-4 px-1 text-xs'>
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='APPROVED'>Đã duyệt</TabsTrigger>
          <TabsTrigger value='REJECTED'>Đã từ chối</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
