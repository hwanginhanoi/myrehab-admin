'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAllExercises } from '@/api'
import type { ExerciseResponse } from '@/api'
import { cn } from '@/lib/utils'

interface ExerciseSelectorDNDProps {
  selectedExercises: ExerciseResponse[]
  onChange: (exercises: ExerciseResponse[]) => void
  disabled?: boolean
}

export function ExerciseSelectorDND({
  selectedExercises,
  onChange,
  disabled = false,
}: ExerciseSelectorDNDProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 10

  // Fetch available exercises
  const { data: exercisesResponse, isLoading } = useGetAllExercises(
    {
      pageable: { page, size: pageSize },
      query: searchQuery || undefined,
    } as any,
    {
      query: {
        placeholderData: (previousData) => previousData,
      },
    }
  )

  const availableExercises = exercisesResponse?.content || []
  const totalPages = exercisesResponse?.totalPages || 0

  // Filter out already selected exercises from available list
  const selectedIds = new Set(selectedExercises.map((ex) => ex.id))
  const filteredAvailableExercises = availableExercises.filter(
    (ex) => !selectedIds.has(ex.id)
  )

  // DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = selectedExercises.findIndex((ex) => ex.id === active.id)
      const newIndex = selectedExercises.findIndex((ex) => ex.id === over.id)

      onChange(arrayMove(selectedExercises, oldIndex, newIndex))
    }
  }

  const handleAddExercise = (exercise: ExerciseResponse) => {
    if (!selectedIds.has(exercise.id)) {
      onChange([...selectedExercises, exercise])
    }
  }

  const handleRemoveExercise = (exerciseId: number | undefined) => {
    if (exerciseId !== undefined) {
      onChange(selectedExercises.filter((ex) => ex.id !== exerciseId))
    }
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      {/* Left Panel: Available Exercises */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Bài tập khả dụng</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Search */}
          <Input
            placeholder='Tìm kiếm bài tập...'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(0)
            }}
            disabled={disabled}
            className='h-9'
          />

          {/* Exercise List */}
          <ScrollArea className='h-[400px] pr-4'>
            {isLoading ? (
              <div className='flex items-center justify-center h-32'>
                <p className='text-sm text-muted-foreground'>Đang tải...</p>
              </div>
            ) : filteredAvailableExercises.length > 0 ? (
              <div className='space-y-2'>
                {filteredAvailableExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className='flex items-center justify-between p-3 border rounded-lg hover:bg-accent'
                  >
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm truncate'>
                        {exercise.title}
                      </p>
                      {exercise.categories && exercise.categories.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {exercise.categories.slice(0, 3).map((category) => (
                            <Badge key={category.id} variant='outline' className='text-xs'>
                              {category.name}
                            </Badge>
                          ))}
                          {exercise.categories.length > 3 && (
                            <Badge variant='outline' className='text-xs'>
                              +{exercise.categories.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleAddExercise(exercise)}
                      disabled={disabled}
                      className='ml-2'
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center h-32'>
                <p className='text-sm text-muted-foreground'>
                  {searchQuery ? 'Không tìm thấy bài tập' : 'Không có bài tập khả dụng'}
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-between pt-2 border-t'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || disabled}
              >
                Trước
              </Button>
              <span className='text-sm text-muted-foreground'>
                Trang {page + 1} / {totalPages}
              </span>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || disabled}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Panel: Selected Exercises (DND) */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>
            Bài tập đã chọn ({selectedExercises.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[480px] pr-4'>
            {selectedExercises.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedExercises.map((ex) => ex.id!)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className='space-y-2'>
                    {selectedExercises.map((exercise, index) => (
                      <SortableExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        onRemove={handleRemoveExercise}
                        disabled={disabled}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className='flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg'>
                <p className='text-sm text-muted-foreground text-center'>
                  Chưa có bài tập nào được chọn.
                  <br />
                  Thêm bài tập từ danh sách bên trái.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Sortable Exercise Item Component
interface SortableExerciseItemProps {
  exercise: ExerciseResponse
  index: number
  onRemove: (id: number | undefined) => void
  disabled: boolean
}

function SortableExerciseItem({
  exercise,
  index,
  onRemove,
  disabled,
}: SortableExerciseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id!, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-3 border rounded-lg bg-background',
        isDragging && 'opacity-50 shadow-lg',
        !disabled && 'cursor-move'
      )}
    >
      {/* Drag Handle */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing'
        >
          <GripVertical size={16} className='text-muted-foreground' />
        </div>
      )}

      {/* Order Number */}
      <div className='flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold'>
        {index + 1}
      </div>

      {/* Exercise Info */}
      <div className='flex-1 min-w-0'>
        <p className='font-medium text-sm truncate'>{exercise.title}</p>
        {exercise.durationMinutes && (
          <p className='text-xs text-muted-foreground'>
            {exercise.durationMinutes} phút
          </p>
        )}
      </div>

      {/* Remove Button */}
      {!disabled && (
        <Button
          size='sm'
          variant='ghost'
          onClick={() => onRemove(exercise.id)}
          className='h-8 w-8 p-0'
        >
          <X size={16} />
        </Button>
      )}
    </div>
  )
}
