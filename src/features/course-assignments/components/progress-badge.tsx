import { CheckCircle, Play, Circle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type ProgressBadgeProps = {
  hasStarted?: boolean
  isCompleted?: boolean
}

export function ProgressBadge({ hasStarted, isCompleted }: ProgressBadgeProps) {
  if (isCompleted) {
    return (
      <Badge variant='default' className='flex items-center gap-1.5 w-fit bg-green-500'>
        <CheckCircle className='size-3' />
        Hoàn thành
      </Badge>
    )
  }

  if (hasStarted) {
    return (
      <Badge variant='secondary' className='flex items-center gap-1.5 w-fit'>
        <Play className='size-3' />
        Đang thực hiện
      </Badge>
    )
  }

  return (
    <Badge variant='outline' className='flex items-center gap-1.5 w-fit'>
      <Circle className='size-3' />
      Chưa bắt đầu
    </Badge>
  )
}
