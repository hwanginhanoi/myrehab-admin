import { useMemo } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/server-data-table'
import {
  type CategoryResponse,
  type ExercisePackageResponse,
  useGetAllCategories,
} from '@/api'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  FilterButton,
  getCategoryTypeLabel,
} from './exercise-selector-dnd'

type ExercisePackagesTableToolbarProps = {
  table: Table<ExercisePackageResponse>
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ExercisePackagesTableToolbar({
  table,
  search,
  navigate,
}: ExercisePackagesTableToolbarProps) {
  const categoryId = search.categoryId as number | undefined

  // Fetch categories for filter
  const { data: categoriesResponse } = useGetAllCategories({
    pageable: { page: 0, size: 10000 },
  })

  const categoryGroups = useMemo(() => {
    const categories = (categoriesResponse?.content || []) as CategoryResponse[]
    const groupsMap = new Map<string, CategoryResponse[]>()

    categories.forEach((category) => {
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
        .filter((cat) => cat.name && cat.id !== undefined)
        .map((cat) => ({
          label: cat.name!,
          value: String(cat.id!),
        })),
    }))
  }, [categoriesResponse])

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter ||
    categoryId

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {/* Search by title */}
        <Input
          placeholder="Tìm kiếm gói bài tập..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* Category filter */}
        <FilterButton
          title="Danh mục"
          groups={categoryGroups}
          selectedValues={categoryId ? [String(categoryId)] : []}
          onChange={(values) => {
            // API supports single categoryId, take the last selected
            const newCategoryId =
              values.length > 0 ? Number(values[values.length - 1]) : undefined
            void navigate({
              search: {
                ...search,
                categoryId: newCategoryId,
                page: 1, // Reset to first page on filter change
              },
            })
          }}
        />

        {/* Reset filters button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
              void navigate({
                search: {
                  ...search,
                  categoryId: undefined,
                },
              })
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Column visibility toggle */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
