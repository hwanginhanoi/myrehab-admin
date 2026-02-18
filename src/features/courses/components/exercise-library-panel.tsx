'use client'

import { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { PlusCircledIcon, CheckIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
import { useGetAllExercises, useGetAllCategories, useGetAllGroups, type ExerciseResponse, type CategoryResponse, type GroupResponse } from '@/api'
import { cn } from '@/lib/utils'

type ExerciseLibraryPanelProps = {
  onAddExercise?: (exercise: ExerciseResponse) => void
}

export function ExerciseLibraryPanel({ onAddExercise }: ExerciseLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([])
  const pageSize = 10

  // Fetch categories and groups for filters
  const { data: categoriesResponse } = useGetAllCategories({
    pageable: {
      page: 0,
      size: 10000,
    },
  })
  const { data: groupsResponse } = useGetAllGroups({
    pageable: {
      page: 0,
      size: 10000,
    },
  })

  // Group categories by type
  const categoryGroups = useMemo(() => {
    const categories = (categoriesResponse?.content || []) as CategoryResponse[]
    const groupsMap = new Map<string, CategoryResponse[]>()

    categories.forEach((category: CategoryResponse) => {
      const type = category.type
      if (type && !groupsMap.has(type)) {
        groupsMap.set(type, [])
      }
      if (type) {
        groupsMap.get(type)?.push(category)
      }
    })

    return Array.from(groupsMap.entries()).map(([type, cats]) => ({
      label: getCategoryTypeLabel(type),
      options: cats
        .filter((cat: CategoryResponse) => cat.name && cat.id !== undefined)
        .map((cat: CategoryResponse) => ({
          label: cat.name!,
          value: String(cat.id!),
        })),
    }))
  }, [categoriesResponse])

  const groupOptions = useMemo(() => {
    const groups = (groupsResponse?.content || []) as GroupResponse[]
    return [
      {
        label: 'Kho bài tập',
        options: groups.map((group: GroupResponse) => ({
          label: group.name || '',
          value: String(group.id),
        })),
      },
    ]
  }, [groupsResponse])

  // Fetch exercises
  const { data: exercisesResponse, isLoading } = useGetAllExercises(
    {
      pageable: { page, size: pageSize },
      query: searchQuery || undefined,
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds.map(Number) : undefined,
      groupIds: selectedGroupIds.length > 0 ? selectedGroupIds.map(Number) : undefined,
    },
    {
      query: {
        placeholderData: (previousData) => previousData,
      },
    }
  )

  const exercises = (exercisesResponse?.content || []) as ExerciseResponse[]
  const totalPages = exercisesResponse?.page?.totalPages || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Thư viện bài tập</CardTitle>
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
          className='h-8 w-full'
        />

        {/* Filters */}
        <div className='flex flex-wrap gap-2'>
          <FilterButton
            title='Danh mục'
            groups={categoryGroups}
            selectedValues={selectedCategoryIds}
            onChange={(values) => {
              setSelectedCategoryIds(values)
              setPage(0)
            }}
          />
          <FilterButton
            title='Kho bài tập'
            groups={groupOptions}
            selectedValues={selectedGroupIds}
            onChange={(values) => {
              setSelectedGroupIds(values)
              setPage(0)
            }}
          />
        </div>

        {/* Exercise List */}
        <ScrollArea className='h-[500px] pr-4'>
          {isLoading ? (
            <div className='flex items-center justify-center h-32'>
              <p className='text-sm text-muted-foreground'>Đang tải...</p>
            </div>
          ) : exercises.length > 0 ? (
            <div className='space-y-2'>
              {exercises.map((exercise) => (
                <LibraryExerciseCard key={exercise.id} exercise={exercise} onAdd={onAddExercise} />
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
            disabled={page === 0 || totalPages === 0}
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
            disabled={page >= totalPages - 1 || totalPages === 0}
          >
            Sau
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Library Exercise Card Component
type LibraryExerciseCardProps = {
  exercise: ExerciseResponse
  onAdd?: (exercise: ExerciseResponse) => void
}

function LibraryExerciseCard({ exercise }: LibraryExerciseCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${exercise.id}`,
    data: { type: 'library-exercise', exercise },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'flex items-center gap-3 p-3 border rounded-lg cursor-grab hover:bg-accent transition-colors',
        isDragging && 'opacity-50'
      )}
    >
      {/* Exercise image */}
      {exercise.imageUrl && (
        <img
          src={exercise.imageUrl}
          alt={exercise.title || ''}
          className='w-12 h-12 rounded object-cover'
        />
      )}

      {/* Exercise info */}
      <div className='flex-1 min-w-0'>
        <p className='font-medium text-sm truncate'>{exercise.title}</p>
        {exercise.durationMinutes && (
          <p className='text-xs text-muted-foreground'>{exercise.durationMinutes} phút</p>
        )}
        {exercise.categories && exercise.categories.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-1'>
            {exercise.categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant='outline' className='text-xs'>
                {category.name}
              </Badge>
            ))}
            {exercise.categories.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{exercise.categories.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Filter Button Component
type OptionGroup = {
  label: string
  options: {
    label: string
    value: string
  }[]
}

type FilterButtonProps = {
  title: string
  groups: OptionGroup[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

function FilterButton({ title, groups, selectedValues, onChange }: FilterButtonProps) {
  const [open, setOpen] = useState(false)
  const selectedSet = new Set(selectedValues)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircledIcon className='size-4' />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.length > 2 ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
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
                  <CommandItem onSelect={() => onChange([])} className='justify-center text-center'>
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

// Helper function
function getCategoryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    BODY_PART: 'Bộ phận cơ thể',
    HEALTH_CONDITION: 'Tình trạng sức khỏe',
    EXERCISE_TYPE: 'Loại bài tập',
    EXERCISE_EQUIPMENTS: 'Dụng cụ tập luyện',
    OTHERS: 'Khác',
  }
  return labels[type] || type
}
