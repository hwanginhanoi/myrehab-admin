import { type Row } from '@tanstack/react-table'
import { ClipboardCheck } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import type { CourseRequest } from '@/features/course-requests/types'

type DoctorCourseRequestsRowActionsProps = {
  row: Row<CourseRequest>
}

export function DoctorCourseRequestsRowActions({ row }: DoctorCourseRequestsRowActionsProps) {
  const navigate = useNavigate()
  const id = row.original.id

  return (
    <div className='flex justify-end'>
      <Button
        variant='ghost'
        size='sm'
        className='gap-1 h-8'
        onClick={() => {
          navigate({
            to: '/doctor-course-requests/$id',
            params: { id: String(id) },
            state: { requestData: row.original },
          })
        }}
      >
        <ClipboardCheck className='h-4 w-4' />
        Xét duyệt
      </Button>
    </div>
  )
}
