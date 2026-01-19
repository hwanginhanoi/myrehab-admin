'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { CustomExercise } from './course-assignment-screen'

type ExerciseCardDraggableProps = {
  exercise: CustomExercise
  index: number
  dayNumber: number
  onEdit: (exercise: CustomExercise) => void
  onRemove: (exerciseId: string) => void
}

export function ExerciseCardDraggable({
  exercise,
  index,
  dayNumber,
  onEdit,
  onRemove,
}: ExerciseCardDraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exercise.id,
    data: { type: 'exercise', dayNumber, exerciseId: exercise.exerciseId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 border rounded-lg bg-background transition-all shadow-sm',
        isDragging && 'opacity-50 shadow-lg scale-105'
      )}
    >
      {/* Drag handle and number badge */}
      <div className='flex items-center gap-2'>
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing touch-none'
        >
          <GripVertical className='h-5 w-5 text-muted-foreground' />
        </div>
        <div className='flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium'>
          {index + 1}
        </div>
      </div>

      {/* Exercise image */}
      {exercise.exerciseImageUrl && (
        <img
          src={exercise.exerciseImageUrl}
          alt={exercise.exerciseTitle}
          className='w-16 h-16 rounded object-cover'
        />
      )}

      {/* Exercise info */}
      <div className='flex-1 min-w-0'>
        <p className='font-medium text-base truncate'>{exercise.exerciseTitle}</p>
        <div className='flex flex-wrap items-center gap-2 mt-1'>
          {exercise.customRepetitions && (
            <Badge variant='outline' className='text-xs'>
              {exercise.customRepetitions} lần lặp
            </Badge>
          )}
          {exercise.customSets && (
            <Badge variant='outline' className='text-xs'>
              {exercise.customSets} set
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onRemove(exercise.id)}
        className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive'
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  )
}
