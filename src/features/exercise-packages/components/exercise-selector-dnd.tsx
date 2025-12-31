'use client'

import { useMemo, useState } from 'react'
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
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useGetAllExercises, useGetAllCategories, useGetAllGroups } from '@/api'
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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const pageSize = 10

  // Fetch categories and groups for filters
  const { data: categoriesResponse } = useGetAllCategories({
    pageable: {
      page: 0,
      size: 10000, // Get all categories
    },
  })
  const { data: groupsResponse } = useGetAllGroups({
    pageable: {
      page: 0,
      size: 10000, // Get all groups
    },
  })

  // Group categories by type
  const categoryGroups = useMemo(() => {
    const categories = categoriesResponse?.content || []
    const groupsMap = new Map<string, typeof categories>()

    categories.forEach((category) => {
      const type = category.type
      if (type && !groupsMap.has(type)) {
        groupsMap.set(type, [])
      }
      if (type) {
        groupsMap.get(type)?.push(category)
      }
    })

    // Convert to array format expected by the grouped multi-select
    return Array.from(groupsMap.entries()).map(([type, cats]) => ({
      label: getCategoryTypeLabel(type),
      options: cats
        .filter((cat) => cat.name && cat.id !== undefined)
        .map((cat) => ({
          label: cat.name!,
          value: String(cat.id!),
        })),
    }))
  }, [categoriesResponse])

  // Wrap groups in a single group for consistent styling
  const groupOptions = useMemo(() => {
    const groups = groupsResponse?.content || []
    return [{
      label: 'Kho bài tập',
      options: groups.map((group) => ({
        label: group.name || '',
        value: String(group.id),
      })),
    }]
  }, [groupsResponse])

  // Fetch available exercises
  const { data: exercisesResponse, isLoading } = useGetAllExercises(
    {
      pageable: { page, size: pageSize },
      query: searchQuery || undefined,
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds.map(Number) : undefined,
      groupIds: selectedGroupIds.length > 0 ? selectedGroupIds.map(Number) : undefined,
    } as any,
    {
      query: {
        placeholderData: (previousData) => previousData,
      },
    }
  )

  const availableExercises = exercisesResponse?.content || []
  const totalPages = exercisesResponse?.page?.totalPages || 0

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
            className='h-8 w-full sm:w-[150px] lg:w-[250px]'
          />

          {/* Filters */}
          <div className='flex gap-2'>
            <FilterButton
              title='Danh mục'
              groups={categoryGroups}
              selectedValues={selectedCategoryIds}
              onChange={(values) => {
                setSelectedCategoryIds(values)
                setPage(0)
              }}
              disabled={disabled}
            />
            <FilterButton
              title='Kho bài tập'
              groups={groupOptions}
              selectedValues={selectedGroupIds}
              onChange={(values) => {
                setSelectedGroupIds(values)
                setPage(0)
              }}
              disabled={disabled}
            />
          </div>

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
          <div className='flex items-center justify-between pt-2 border-t'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || disabled || totalPages === 0}
            >
              Trước
            </Button>
            <span className='text-sm text-muted-foreground'>
              Trang {totalPages === 0 ? 0 : page + 1} / {totalPages === 0 ? 0 : totalPages}
            </span>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || disabled || totalPages === 0}
            >
              Sau
            </Button>
          </div>
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

// Filter Button Component (styled like DataTableGroupedMultiSelectFilter)
type OptionGroup = {
  label: string
  options: {
    label: string
    value: string
  }[]
}

interface FilterButtonProps {
  title: string
  groups: OptionGroup[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  disabled?: boolean
}

function FilterButton({
  title,
  groups,
  selectedValues,
  onChange,
  disabled = false,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false)
  const selectedSet = new Set(selectedValues)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8 border-dashed'
          disabled={disabled}
        >
          <PlusCircledIcon className='size-4' />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.length > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  groups
                    .flatMap((group) => group.options)
                    .filter((option) => selectedSet.has(option.value))
                    .slice(0, 2)
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[250px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            {groups.map((group, groupIndex) => (
              <div key={group.label}>
                <CommandGroup heading={group.label}>
                  {group.options.map((option) => {
                    const isSelected = selectedSet.has(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          const newValues = isSelected
                            ? selectedValues.filter((v) => v !== option.value)
                            : [...selectedValues, option.value]
                          onChange(newValues)
                        }}
                      >
                        <div
                          className={cn(
                            'border-primary flex size-4 items-center justify-center rounded-sm border mr-2',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className='h-4 w-4' />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {groupIndex < groups.length - 1 && <CommandSeparator />}
              </div>
            ))}
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className='justify-center text-center'
                  >
                    Xóa tất cả
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Helper function to get Vietnamese labels for category types
function getCategoryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    BODY_PART: 'Vị trí cơ thể',
    RECOVERY_STAGE: 'Giai đoạn phục hồi',
    HEALTH_CONDITION: 'Tình trạng sức khỏe',
    DIFFICULTY_LEVEL: 'Độ khó',
    EXERCISE_TYPE: 'Loại bài tập',
  }
  return labels[type] || type
}
