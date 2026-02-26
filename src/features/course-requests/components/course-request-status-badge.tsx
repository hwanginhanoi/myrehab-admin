import { Badge } from '@/components/ui/badge'
import type { CourseRequestStatus } from '../types'

type CourseRequestStatusBadgeProps = {
  status?: CourseRequestStatus | string
}

export function CourseRequestStatusBadge({ status }: CourseRequestStatusBadgeProps) {
  if (!status) return null

  switch (status) {
    case 'PENDING':
      return (
        <Badge variant='outline' className='border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'>
          Chờ duyệt
        </Badge>
      )
    case 'APPROVED':
      return (
        <Badge variant='outline' className='border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20'>
          Đã duyệt
        </Badge>
      )
    case 'REJECTED':
      return (
        <Badge variant='outline' className='border-red-500 text-red-600 bg-red-50 dark:bg-red-950/20'>
          Bị từ chối
        </Badge>
      )
    default:
      return <Badge variant='outline'>{status}</Badge>
  }
}
