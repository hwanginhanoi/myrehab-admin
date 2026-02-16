'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { DayContainer } from './day-container'
import { ExerciseLibraryPanel } from './exercise-library-panel'
import { ExerciseCustomizationDialog } from './exercise-customization-dialog'
import type { ExerciseResponse } from '@/api'
import type { DayWithExercises, CustomExercise } from './course-assignment-screen'

type CourseAction =
  | { type: 'MOVE_EXERCISE'; payload: { exerciseId: string; fromDay: number; toDay: number; newIndex: number } }
  | { type: 'ADD_EXERCISE_TO_DAY'; payload: { dayNumber: number; exercise: CustomExercise } }
  | { type: 'REORDER_EXERCISES'; payload: { dayNumber: number; exercises: CustomExercise[] } }
  | { type: 'UPDATE_EXERCISE'; payload: { dayNumber: number; exerciseId: string; updates: Partial<CustomExercise> } }
  | { type: 'REMOVE_EXERCISE'; payload: { dayNumber: number; exerciseId: string } }
  | { type: 'DELETE_DAY'; payload: number }
  | { type: 'DUPLICATE_DAY'; payload: number }
  | { type: 'ADD_DAY' }

type CourseCustomizationSectionProps = {
  courseName: string
  customizedDays: Map<number, DayWithExercises>
  dispatch: React.Dispatch<CourseAction>
}

export function CourseCustomizationSection({
  courseName: _courseName,
  customizedDays,
  dispatch,
}: CourseCustomizationSectionProps) {
  const [, setActiveId] = useState<string | null>(null)
  const [activeExercise, setActiveExercise] = useState<ExerciseResponse | null>(null)
  const [editingExercise, setEditingExercise] = useState<CustomExercise | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Helper to convert ExerciseResponse to CustomExercise
  const convertToCustomExercise = (exercise: ExerciseResponse): CustomExercise => {
    return {
      id: crypto.randomUUID(),
      exerciseId: exercise.id!,
      exerciseTitle: exercise.title || '',
      exerciseDescription: exercise.description,
      exerciseImageUrl: exercise.imageUrl,
      orderInDay: 0,
      customRepetitions: undefined,
      customSets: undefined,
    }
  }

  // Find day number for exercise
  const findDayNumberForExercise = (id: string): number | null => {
    for (const [dayNum, day] of customizedDays) {
      if (day.exercises.some((ex) => ex.id === id)) {
        return dayNum
      }
    }
    return null
  }

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    // If dragging from library, store the exercise
    const activeData = active.data.current
    if (activeData?.type === 'library-exercise') {
      setActiveExercise(activeData.exercise as ExerciseResponse)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // Only handle moving between days during drag over
    if (activeData?.type === 'exercise' && overData?.type === 'day') {
      const fromDay = activeData.dayNumber as number
      const toDay = overData.dayNumber as number

      if (fromDay !== toDay) {
        const sourceDay = customizedDays.get(fromDay)
        const targetDay = customizedDays.get(toDay)

        if (!sourceDay || !targetDay) return

        const exerciseIndex = sourceDay.exercises.findIndex((ex) => ex.id === active.id)
        if (exerciseIndex === -1) return

        // Check if target already has this exercise
        const exerciseId = sourceDay.exercises[exerciseIndex].exerciseId
        const exists = targetDay.exercises.some((ex) => ex.exerciseId === exerciseId)
        if (exists) return // Don't move during dragover if duplicate

        // Preview the move
        dispatch({
          type: 'MOVE_EXERCISE',
          payload: {
            exerciseId: active.id as string,
            fromDay,
            toDay,
            newIndex: targetDay.exercises.length, // Add to end
          },
        })
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveExercise(null)

    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // Adding from library to day
    if (activeData?.type === 'library-exercise') {
      const exercise = activeData.exercise as ExerciseResponse
      let targetDay: number | null = null

      if (overData?.type === 'day') {
        targetDay = overData.dayNumber
      } else if (overData?.type === 'exercise') {
        targetDay = overData.dayNumber
      }

      if (targetDay !== null) {
        const customExercise = convertToCustomExercise(exercise)
        dispatch({
          type: 'ADD_EXERCISE_TO_DAY',
          payload: {
            dayNumber: targetDay,
            exercise: customExercise,
          },
        })
      }
      return
    }

    // Reordering or moving exercises
    if (activeData?.type === 'exercise') {
      const fromDay = findDayNumberForExercise(active.id as string)
      let toDay: number | null = null

      if (overData?.type === 'day') {
        toDay = overData.dayNumber
      } else if (overData?.type === 'exercise') {
        toDay = overData.dayNumber
      }

      if (fromDay === null || toDay === null) return

      // Reordering within same day
      if (fromDay === toDay && over.id !== active.id) {
        const day = customizedDays.get(fromDay)
        if (!day) return

        const oldIndex = day.exercises.findIndex((ex) => ex.id === active.id)
        const newIndex = day.exercises.findIndex((ex) => ex.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(day.exercises, oldIndex, newIndex)
          dispatch({
            type: 'REORDER_EXERCISES',
            payload: {
              dayNumber: fromDay,
              exercises: reordered,
            },
          })
        }
      }
      // Moving between days - already handled in dragOver
    }
  }

  // Edit exercise
  const handleEditExercise = (exercise: CustomExercise) => {
    setEditingExercise(exercise)
    setDialogOpen(true)
  }

  // Save exercise customization
  const handleSaveCustomization = (updates: Partial<CustomExercise>) => {
    if (!editingExercise) return

    const dayNumber = findDayNumberForExercise(editingExercise.id)
    if (dayNumber === null) return

    dispatch({
      type: 'UPDATE_EXERCISE',
      payload: {
        dayNumber,
        exerciseId: editingExercise.id,
        updates,
      },
    })

    toast.success('Đã cập nhật bài tập')
  }

  // Remove exercise
  const handleRemoveExercise = (dayNumber: number, exerciseId: string) => {
    dispatch({
      type: 'REMOVE_EXERCISE',
      payload: {
        dayNumber,
        exerciseId,
      },
    })
    toast.success('Đã xóa bài tập')
  }

  // Delete day
  const handleDeleteDay = (dayNumber: number) => {
    if (customizedDays.size <= 1) {
      toast.error('Phải có ít nhất một ngày')
      return
    }
    dispatch({ type: 'DELETE_DAY', payload: dayNumber })
    toast.success('Đã xóa ngày')
  }

  // Duplicate day
  const handleDuplicateDay = (dayNumber: number) => {
    dispatch({ type: 'DUPLICATE_DAY', payload: dayNumber })
    toast.success('Đã nhân bản ngày')
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='mb-4'>
        <h3 className='text-xl font-bold'>Chi tiết lộ trình</h3>
        <p className='text-sm text-muted-foreground'>
          Kéo thả bài tập giữa các ngày hoặc thêm từ thư viện bên trái
        </p>
      </div>

      {/* DnD Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden'>
          {/* Left Panel: Exercise Library */}
          <div className='lg:col-span-1'>
            <ExerciseLibraryPanel />
          </div>

          {/* Right Panel: Day Containers */}
          <div className='lg:col-span-1'>
            <ScrollArea className='h-[600px]'>
              <div className='space-y-4 pr-4'>
                {Array.from(customizedDays.entries())
                  .sort(([a], [b]) => a - b)
                  .map(([dayNum, day]) => (
                    <DayContainer
                      key={dayNum}
                      day={day}
                      onEditExercise={handleEditExercise}
                      onRemoveExercise={handleRemoveExercise}
                      onDeleteDay={handleDeleteDay}
                      onDuplicateDay={handleDuplicateDay}
                      canDelete={customizedDays.size > 1}
                    />
                  ))}

                {/* Add Day Button */}
                <Button
                  variant='default'
                  onClick={() => dispatch({ type: 'ADD_DAY' })}
                  className='w-full gap-2'
                >
                  Thêm ngày
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Simple Drag Overlay for Library Exercises */}
        <DragOverlay dropAnimation={null}>
          {activeExercise && (
            <div className='flex items-center gap-3 p-3 border rounded-lg bg-background shadow-lg opacity-90'>
              {activeExercise.imageUrl && (
                <img
                  src={activeExercise.imageUrl}
                  alt={activeExercise.title || ''}
                  className='w-12 h-12 rounded object-cover'
                />
              )}
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-sm truncate'>{activeExercise.title}</p>
                {activeExercise.durationMinutes && (
                  <p className='text-xs text-muted-foreground'>{activeExercise.durationMinutes} phút</p>
                )}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Exercise Customization Dialog */}
      <ExerciseCustomizationDialog
        exercise={editingExercise}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCustomization}
      />
    </div>
  )
}
