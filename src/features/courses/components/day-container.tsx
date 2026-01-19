'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GripVertical, Copy, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExerciseCardDraggable } from './exercise-card-draggable'
import { EmptyDayPlaceholder } from './empty-day-placeholder'
import type { DayWithExercises, CustomExercise } from './course-assignment-screen'

type DayContainerProps = {
  day: DayWithExercises
  onEditExercise: (exercise: CustomExercise) => void
  onRemoveExercise: (dayNumber: number, exerciseId: string) => void
  onDeleteDay: (dayNumber: number) => void
  onDuplicateDay: (dayNumber: number) => void
  canDelete: boolean
}

export function DayContainer({ day, onEditExercise, onRemoveExercise, onDeleteDay, onDuplicateDay, canDelete }: DayContainerProps) {

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.dayNumber}`,
    data: { type: 'day', dayNumber: day.dayNumber },
  })

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'min-h-[200px] transition-colors',
        isOver && 'border-primary bg-accent/50'
      )}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <GripVertical className='h-5 w-5 text-muted-foreground cursor-grab' />
          <div className='flex-1'>
            <CardTitle className='text-xl font-bold'>Ngày {day.dayNumber}</CardTitle>
            {day.description && (
              <CardDescription className='mt-1'>{day.description}</CardDescription>
            )}
          </div>
          {/* Action buttons */}
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onDuplicateDay(day.dayNumber)}
              className='h-8 w-8 p-0'
              title='Nhân bản ngày'
            >
              <Copy className='h-4 w-4' />
            </Button>
            {canDelete && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onDeleteDay(day.dayNumber)}
                className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive'
                title='Xóa ngày'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {day.exercises.length === 0 ? (
            <EmptyDayPlaceholder />
          ) : (
            <>
              <SortableContext
                items={day.exercises.map((ex) => ex.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-2'>
                  {day.exercises.map((exercise, index) => (
                    <ExerciseCardDraggable
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      dayNumber={day.dayNumber}
                      onEdit={onEditExercise}
                      onRemove={(exerciseId) => onRemoveExercise(day.dayNumber, exerciseId)}
                    />
                  ))}
                </div>
              </SortableContext>
              <EmptyDayPlaceholder isAddButton />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
