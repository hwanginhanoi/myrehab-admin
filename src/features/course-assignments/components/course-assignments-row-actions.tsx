import { type Row } from '@tanstack/react-table'
import { MoreHorizontal, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CourseAssignmentDetail } from '../types'
import { useCourseAssignments } from './course-assignments-provider'

type CourseAssignmentsRowActionsProps = {
  row: Row<CourseAssignmentDetail>
}

export function CourseAssignmentsRowActions({ row }: CourseAssignmentsRowActionsProps) {
  const { setCurrentAssignment, setIsPreviewOpen } = useCourseAssignments()

  const handleViewDetails = () => {
    setCurrentAssignment(row.original)
    setIsPreviewOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className='size-4' />
          Xem chi tiết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
