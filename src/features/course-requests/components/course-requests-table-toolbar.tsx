import { type Table } from '@tanstack/react-table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CourseRequest, CourseRequestStatus } from '../types'

type CourseRequestsTableToolbarProps = {
  table: Table<CourseRequest>
  currentStatus?: CourseRequestStatus
  onStatusChange: (status?: CourseRequestStatus) => void
}

export function CourseRequestsTableToolbar({
  currentStatus,
  onStatusChange,
}: CourseRequestsTableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Tabs
        value={currentStatus ?? 'all'}
        onValueChange={(value) => {
          onStatusChange(
            value === 'all' ? undefined : (value as CourseRequestStatus)
          )
        }}
      >
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="PENDING">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="APPROVED">Đã duyệt</TabsTrigger>
          <TabsTrigger value="REJECTED">Bị từ chối</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
