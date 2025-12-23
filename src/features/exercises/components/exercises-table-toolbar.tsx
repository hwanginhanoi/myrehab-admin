import { useMemo } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableGroupedMultiSelectFilter, DataTableViewOptions } from '@/components/server-data-table'
import type { ExerciseResponse, CategoryResponse } from '@/api'

type ExercisesTableToolbarProps = {
  table: Table<ExerciseResponse>
  allCategories: CategoryResponse[]
}

export function ExercisesTableToolbar({ table, allCategories }: ExercisesTableToolbarProps) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  // Group categories by type
  const categoryGroups = useMemo(() => {
    const groups = new Map<string, CategoryResponse[]>()

    allCategories.forEach((category) => {
      const type = category.type
      if (type && !groups.has(type)) {
        groups.set(type, [])
      }
      if (type) {
        groups.get(type)?.push(category)
      }
    })

    // Convert to array format expected by the filter
    return Array.from(groups.entries()).map(([type, categories]) => ({
      label: getCategoryTypeLabel(type),
      options: categories
        .filter((cat) => cat.name && cat.id !== undefined)
        .map((cat) => ({
          label: cat.name!,
          value: String(cat.id!), // Convert to string for filter
        })),
    }))
  }, [allCategories])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* Search by title */}
        <Input
          placeholder='Tìm kiếm bài tập...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {/* Category filter - grouped by type */}
        <div className='flex gap-x-2'>
          {categoryGroups.length > 0 && (
            <DataTableGroupedMultiSelectFilter
              column={table.getColumn('categoryIds')}
              title='Danh mục'
              groups={categoryGroups}
            />
          )}
        </div>

        {/* Reset filters button */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>

      {/* Column visibility toggle */}
      <DataTableViewOptions table={table} />
    </div>
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
