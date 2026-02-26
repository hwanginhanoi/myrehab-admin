import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { useGetAllExercises } from '@/api'
import type { ParsedCourseDetails } from '@/features/course-requests/types'

type CourseDetailsReadOnlyProps = {
  courseDetails: { [key: string]: object } | undefined
}

export function CourseDetailsReadOnly({ courseDetails }: CourseDetailsReadOnlyProps) {
  const details = courseDetails as unknown as ParsedCourseDetails | undefined

  const { data: exercisesData } = useGetAllExercises(
    { pageable: { page: 0, size: 1000 } },
    { query: { enabled: !!details?.days?.length } }
  )

  const exerciseMap = new Map<number, string>()
  if (exercisesData?.content) {
    for (const ex of exercisesData.content as { id?: number; title?: string }[]) {
      if (ex.id && ex.title) {
        exerciseMap.set(ex.id, ex.title)
      }
    }
  }

  if (!details) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-muted-foreground'>Không có thông tin chi tiết.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết khóa tập</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-muted-foreground'>Tên khóa tập:</span>
            <p className='font-medium mt-1'>{details.courseName || '-'}</p>
          </div>
          <div>
            <span className='text-muted-foreground'>Số ngày:</span>
            <p className='font-medium mt-1'>{details.durationDays || (details.days?.length ?? 0)} ngày</p>
          </div>
          {details.description && (
            <div className='col-span-2'>
              <span className='text-muted-foreground'>Mô tả:</span>
              <p className='mt-1'>{details.description}</p>
            </div>
          )}
        </div>

        {details.days && details.days.length > 0 && (
          <div className='space-y-2'>
            <h4 className='font-medium text-sm'>Lịch tập theo ngày:</h4>
            {details.days
              .sort((a, b) => a.dayNumber - b.dayNumber)
              .map((day) => (
                <DayCollapsible
                  key={day.dayNumber}
                  day={day}
                  exerciseMap={exerciseMap}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type DayCollapsibleProps = {
  day: NonNullable<ParsedCourseDetails['days']>[number]
  exerciseMap: Map<number, string>
}

function DayCollapsible({ day, exerciseMap }: DayCollapsibleProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-between h-auto py-2 px-3'
          type='button'
        >
          <span className='font-medium'>
            Ngày {day.dayNumber} — {day.exercises.length} bài tập
          </span>
          {open ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='border border-t-0 rounded-b-md p-3 space-y-1'>
          {day.exercises.length === 0 ? (
            <p className='text-sm text-muted-foreground'>Không có bài tập</p>
          ) : (
            day.exercises.map((ex, idx) => (
              <div key={idx} className='flex items-center justify-between text-sm py-1 border-b last:border-0'>
                <span className='font-medium'>
                  {idx + 1}. {exerciseMap.get(ex.exerciseId) ?? `Bài tập #${ex.exerciseId}`}
                </span>
                <span className='text-muted-foreground text-xs'>
                  {ex.sets} hiệp × {ex.repetitions} lần
                </span>
              </div>
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
